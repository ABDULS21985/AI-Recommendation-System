import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ItemDto } from './dto/item.dto';
import { EmailService } from '../notification/email.service';
import { NotificationPreferenceService } from '../notification/notification-preference.service';
import { Recommendation } from './entities/recommendation.entity';
import { RecommendationsGateway } from './recommendations.gateway';

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name); // Initialize Logger

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private notificationPreferenceService: NotificationPreferenceService,
    private recommendationsGateway: RecommendationsGateway,

  ) {}

  // Get recommendations for a user based on domain
  async getRecommendationsForUser(userId: string, domain: string) {
    this.logger.log(`Fetching recommendations for user: ${userId} in domain: ${domain}`);
    const recommendations = await this.prisma.recommendation.findMany({
      where: { userId, domain },
    });

    if (!recommendations.length) {
      this.logger.warn(`No recommendations found for user: ${userId} in domain: ${domain}`);
      throw new NotFoundException(`No recommendations found for user with ID: ${userId} in domain: ${domain}`);
    }

    this.logger.log(`Successfully retrieved recommendations for user: ${userId} in domain: ${domain}`);
    return recommendations;
  }

  // Generate new recommendations for a user based on domain
  async generateRecommendations(userId: string, domain: string) {
    this.logger.log(`Generating recommendations for user: ${userId} in domain: ${domain}`);

    const similarUsers = await this.findSimilarUsers(userId, domain);
    const RecommendationItems = await this.findItemsFromSimilarUsers(similarUsers, domain);


    if (!similarUsers.length) {
      this.logger.warn(`No similar users found for user: ${userId} in domain: ${domain}`);
      throw new NotFoundException(`No similar users found for user with ID: ${userId} in domain: ${domain}`);
      this.logger.warn(`No items found for similar users in domain: ${domain}`);
    }

    const recommendedItems = await this.findItemsFromSimilarUsers(similarUsers, domain);

    if (!recommendedItems.length) {
      this.logger.warn(`No items to recommend based on similar users for user: ${userId} in domain: ${domain}`);
      throw new NotFoundException(`No items to recommend based on similar users for user with ID: ${userId} in domain: ${domain}`);
    }

    const prioritizedItems = this.prioritizeItems(recommendedItems);
    const recommendedItemsJson = JSON.stringify(prioritizedItems);

    // Save recommendations to the database
    const recommendation = await this.prisma.recommendation.create({
      data: {
        userId,
        domain,
        recommendedItems: recommendedItemsJson,
      },
    });

    this.logger.log(`Recommendations successfully generated and saved for user: ${userId} in domain: ${domain}`);

    // Fetch user email for sending notification
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    // Send email notification
    try {
      await this.emailService.sendRecommendationEmail(user.email, prioritizedItems);
      this.logger.log(`Email notification successfully sent to user: ${user.email} in domain: ${domain}`);
    } catch (error) {
      this.logger.error(`Failed to send email to user: ${user.email} in domain: ${domain}`, error.stack);
    }

    return recommendation;
  }

  // Find similar users based on domain-specific interactions
  private async findSimilarUsers(userId: string, domain: string) {
    this.logger.log(`Finding similar users for user: ${userId} in domain: ${domain}`);

    const userInteractions = await this.prisma.userInteraction.findMany({
      where: { userId, domain },
      select: { itemId: true },
    });

    if (!userInteractions.length) {
      this.logger.warn(`No interactions found for user: ${userId} in domain: ${domain}`);
      throw new NotFoundException(`No interactions found for user with ID: ${userId} in domain: ${domain}`);
    }

    const itemIds = userInteractions.map((interaction) => interaction.itemId);

    const similarUsers = await this.prisma.userInteraction.findMany({
      where: {
        itemId: { in: itemIds },
        userId: { not: userId },
        domain,
      },
      distinct: ['userId'],
      select: { userId: true },
    });

    this.logger.log(`Found ${similarUsers.length} similar users for user: ${userId} in domain: ${domain}`);
    return similarUsers.map((interaction) => interaction.userId);
  }

  // Find items from similar users in the specified domain
  private async findItemsFromSimilarUsers(similarUserIds: string[], domain: string): Promise<ItemDto[]> {
    this.logger.log(`Finding items from similar users in domain: ${domain}`);

    const similarUserInteractions = await this.prisma.userInteraction.findMany({
      where: { userId: { in: similarUserIds }, domain },
      distinct: ['itemId'],
      select: { itemId: true, like: true, rating: true },
    });

    this.logger.log(`Found ${similarUserInteractions.length} items from similar users in domain: ${domain}.`);
    return similarUserInteractions.map(interaction => ({
      itemId: interaction.itemId,
      like: interaction.like,
      rating: interaction.rating,
    }));
  }

  // Prioritize items based on likes and ratings
  private prioritizeItems(items: ItemDto[]) {
    this.logger.log(`Prioritizing items based on likes and ratings.`);
    return items.sort((a, b) => {
      const scoreA = (a.like ? 3 : 0) + (a.rating || 0);
      const scoreB = (b.like ? 3 : 0) + (b.rating || 0);
      return scoreB - scoreA; // Higher scores first
    });
  }

  // Check if email should be sent based on user preferences
  private shouldSendEmail(preference: any): boolean {
    if (!preference) return false;
    
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    if (preference.frequency === 'DAILY') {
      return true;
    } else if (preference.frequency === 'WEEKLY' && dayOfWeek === 0) { // Send on Sunday for weekly
      return true;
    }

    return false;
  }
}

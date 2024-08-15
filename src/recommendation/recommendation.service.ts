import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ItemDto } from './dto/item.dto';
import { EmailService } from '../notification/email.service';
import { NotificationPreferenceService } from '../notification/notification-preference.service';

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name); // Initialize Logger

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private notificationPreferenceService: NotificationPreferenceService,
  ) {}

  async getRecommendationsForUser(userId: string) {
    this.logger.log(`Fetching recommendations for user: ${userId}`);
    const recommendations = await this.prisma.recommendation.findMany({
      where: { userId },
    });

    if (!recommendations.length) {
      this.logger.warn(`No recommendations found for user: ${userId}`);
      throw new NotFoundException(`No recommendations found for user with ID: ${userId}`);
    }

    this.logger.log(`Successfully retrieved recommendations for user: ${userId}`);
    return recommendations;
  }

  async generateRecommendations(userId: string) {
    this.logger.log(`Generating recommendations for user: ${userId}`);

    const similarUsers = await this.findSimilarUsers(userId);
    
    if (!similarUsers.length) {
      this.logger.warn(`No similar users found for user: ${userId}`);
      throw new NotFoundException(`No similar users found for user with ID: ${userId}`);
    }

    const recommendedItems = await this.findItemsFromSimilarUsers(similarUsers);

    if (!recommendedItems.length) {
      this.logger.warn(`No items to recommend based on similar users for user: ${userId}`);
      throw new NotFoundException(`No items to recommend based on similar users for user with ID: ${userId}`);
    }

    const recommendedItemsJson = JSON.stringify(recommendedItems);

    // Save recommendations to the database
    const recommendation = await this.prisma.recommendation.create({
      data: {
        userId,
        recommendedItems: recommendedItemsJson,
      },
    });

    this.logger.log(`Recommendations successfully generated and saved for user: ${userId}`);

    // Fetch user email for sending notification
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    // Send email notification
    try {
      await this.emailService.sendRecommendationEmail(user.email, recommendedItems);
      this.logger.log(`Email notification successfully sent to user: ${user.email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to user: ${user.email}`, error.stack);
    }

    return recommendation;
  }

  private async findSimilarUsers(userId: string) {
    this.logger.log(`Finding similar users for user: ${userId}`);

    const userInteractions = await this.prisma.userInteraction.findMany({
      where: { userId },
      select: { itemId: true },
    });

    if (!userInteractions.length) {
      this.logger.warn(`No interactions found for user: ${userId}`);
      throw new NotFoundException(`No interactions found for user with ID: ${userId}`);
    }

    const itemIds = userInteractions.map((interaction) => interaction.itemId);

    const similarUsers = await this.prisma.userInteraction.findMany({
      where: {
        itemId: { in: itemIds },
        userId: { not: userId },
      },
      distinct: ['userId'],
      select: { userId: true },
    });

    this.logger.log(`Found ${similarUsers.length} similar users for user: ${userId}`);
    return similarUsers.map((interaction) => interaction.userId);
  }

  private async findItemsFromSimilarUsers(similarUserIds: string[]): Promise<ItemDto[]> {
    this.logger.log(`Finding items from similar users: ${similarUserIds.join(', ')}`);

    const similarUserInteractions = await this.prisma.userInteraction.findMany({
      where: { userId: { in: similarUserIds } },
      distinct: ['itemId'],
      select: { itemId: true, like: true, rating: true },
    });

    this.logger.log(`Found ${similarUserInteractions.length} items from similar users.`);
    return similarUserInteractions.map(interaction => ({
      itemId: interaction.itemId,
      like: interaction.like,
      rating: interaction.rating,
    }));
  }

  private prioritizeItems(items: ItemDto[]) {
    this.logger.log(`Prioritizing items based on likes and ratings.`);
    return items.sort((a, b) => {
      const scoreA = (a.like ? 1 : 0) + (a.rating || 0);
      const scoreB = (b.like ? 1 : 0) + (b.rating || 0);
      return scoreB - scoreA;
    });
  }

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

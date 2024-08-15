import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInteractionDto } from './dto/create-user-interaction.dto';
import { LikeItemDto } from './dto/like-item.dto';
import { RateItemDto } from './dto/rate-item.dto';

@Injectable()
export class UserInteractionService {
  private readonly logger = new Logger(UserInteractionService.name); // Initialize Logger

  constructor(private prisma: PrismaService) {}

  async logInteraction(data: CreateUserInteractionDto) {
    this.logger.log(`Logging interaction for user ${data.userId} on item ${data.itemId}`);
    try {
      const interaction = await this.prisma.userInteraction.upsert({
        where: {
          userId_itemId: {
            userId: data.userId,
            itemId: data.itemId,
          },
        },
        update: {
          interactionType: data.interactionType,
          rating: data.rating,
          like: data.like,
        },
        create: {
          userId: data.userId,
          itemId: data.itemId,
          interactionType: data.interactionType,
          rating: data.rating,
          like: data.like,
        },
      });
      this.logger.log(`Successfully logged interaction for user ${data.userId}`);
      return interaction;
    } catch (error) {
      this.logger.error(`Failed to log interaction for user ${data.userId}`, error.stack);
      throw error;
    }
  }

  async getUserInteractions(userId: string) {
    this.logger.log(`Fetching interactions for user ${userId}`);
    try {
      const interactions = await this.prisma.userInteraction.findMany({
        where: { userId },
      });
      this.logger.log(`Successfully fetched interactions for user ${userId}`);
      return interactions;
    } catch (error) {
      this.logger.error(`Failed to fetch interactions for user ${userId}`, error.stack);
      throw error;
    }
  }

  async likeItem(userId: string, itemId: string, like: boolean) {
    this.logger.log(`User ${userId} is ${like ? 'liking' : 'disliking'} item ${itemId}`);
    try {
      const result = await this.prisma.userInteraction.upsert({
        where: {
          userId_itemId: { 
            userId,
            itemId,
          },
        },
        update: { like },
        create: { userId, itemId, interactionType: 'like', like },
      });
      this.logger.log(`Successfully processed like/dislike for user ${userId} on item ${itemId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to process like/dislike for user ${userId} on item ${itemId}`, error.stack);
      throw error;
    }
  }

  async rateItem(userId: string, itemId: string, rating: number) {
    this.logger.log(`User ${userId} is rating item ${itemId} with ${rating} stars`);
    try {
      const result = await this.prisma.userInteraction.upsert({
        where: {
          userId_itemId: { 
            userId,
            itemId,
          },
        },
        update: { rating },
        create: { userId, itemId, interactionType: 'rating', rating },
      });
      this.logger.log(`Successfully processed rating for user ${userId} on item ${itemId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to process rating for user ${userId} on item ${itemId}`, error.stack);
      throw error;
    }
  }
}

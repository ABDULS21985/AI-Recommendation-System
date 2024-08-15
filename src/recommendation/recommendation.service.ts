// src/recommendation/recommendation.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class RecommendationService {
  constructor(private prisma: PrismaService) {}

  async getRecommendationsForUser(userId: string) {
    // Retrieve past recommendations from the database
    const recommendations = await this.prisma.recommendation.findMany({
      where: { userId },
    });

    if (!recommendations.length) {
      throw new NotFoundException(`No recommendations found for user with ID: ${userId}`);
    }

    return recommendations;
  }

  async generateRecommendations(userId: string) {
    // Find users who have similar interactions
    const similarUsers = await this.findSimilarUsers(userId);
    
    if (!similarUsers.length) {
      throw new NotFoundException(`No similar users found for user with ID: ${userId}`);
    }

    // Find items interacted with by similar users
    const recommendedItems = await this.findItemsFromSimilarUsers(similarUsers);

    if (!recommendedItems.length) {
      throw new NotFoundException(`No items to recommend based on similar users for user with ID: ${userId}`);
    }

    // Store recommendations in the database
    const recommendedItemsJson = JSON.stringify(recommendedItems);

    return this.prisma.recommendation.create({
      data: { 
        userId, 
        recommendedItems: recommendedItemsJson,
      },
    });
  }

  private async findSimilarUsers(userId: string) {
    // Get the items that the user interacted with
    const userInteractions = await this.prisma.userInteraction.findMany({
      where: { userId },
      select: { itemId: true },
    });

    if (!userInteractions.length) {
      throw new NotFoundException(`No interactions found for user with ID: ${userId}`);
    }

    const itemIds = userInteractions.map((interaction) => interaction.itemId);

    // Find users who interacted with the same items
    const similarUsers = await this.prisma.userInteraction.findMany({
      where: {
        itemId: { in: itemIds },
        userId: { not: userId }, // Exclude the current user
      },
      distinct: ['userId'],
      select: { userId: true },
    });

    return similarUsers.map((interaction) => interaction.userId);
  }

  private async findItemsFromSimilarUsers(similarUserIds: string[]) {
    // Find items interacted with by similar users
    const similarUserInteractions = await this.prisma.userInteraction.findMany({
      where: { userId: { in: similarUserIds } },
      distinct: ['itemId'],
      select: { itemId: true },
    });

    return similarUserInteractions.map((interaction) => interaction.itemId);
  }
}

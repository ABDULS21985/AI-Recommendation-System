// src/userInteraction/user-interaction.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInteractionDto } from './dto/create-user-interaction.dto';
import { LikeItemDto } from './dto/like-item.dto';
import { RateItemDto } from './dto/rate-item.dto';

@Injectable()
export class UserInteractionService {
  constructor(private prisma: PrismaService) {}

  async logInteraction(data: CreateUserInteractionDto) {
    return this.prisma.userInteraction.upsert({
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
  }

  async getUserInteractions(userId: string) {
    return this.prisma.userInteraction.findMany({
      where: { userId },
    });
  }

  async likeItem(userId: string, itemId: string, like: boolean) {
    return this.prisma.userInteraction.upsert({
      where: {
        userId_itemId: { 
          userId,
          itemId,
        },
      },
      update: { like },
      create: { userId, itemId, interactionType: 'like', like },
    });
  }

  async rateItem(userId: string, itemId: string, rating: number) {
    return this.prisma.userInteraction.upsert({
      where: {
        userId_itemId: { 
          userId,
          itemId,
        },
      },
      update: { rating },
      create: { userId, itemId, interactionType: 'rating', rating },
    });
  }
}

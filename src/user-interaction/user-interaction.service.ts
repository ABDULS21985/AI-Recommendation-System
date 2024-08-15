// src/userInteraction/user-interaction.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInteractionDto } from './dto/create-user-interaction.dto';

@Injectable()
export class UserInteractionService {
  constructor(private prisma: PrismaService) {}

  async logInteraction(data: CreateUserInteractionDto) {
    return this.prisma.userInteraction.create({ data });
  }

  async getUserInteractions(userId: string) {
    return this.prisma.userInteraction.findMany({
      where: { userId },
    });
  }
}

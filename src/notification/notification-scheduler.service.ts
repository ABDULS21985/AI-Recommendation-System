// src/notification/notification-scheduler.service.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RecommendationService } from '../recommendation/recommendation.service';
import { Frequency } from '@prisma/client'; // Import the Frequency enum from Prisma

@Injectable()
export class NotificationSchedulerService {
  constructor(
    private prisma: PrismaService,
    private recommendationService: RecommendationService,
  ) {}

  // Run this every day at 7AM
  @Cron('0 7 * * *')
  async handleDailyNotifications() {
    const users = await this.getUsersWithPreference(Frequency.DAILY); // Use the Frequency enum
    for (const user of users) {
      await this.recommendationService.generateRecommendations(user.id);
    }
  }

  // Run this every Sunday at 7AM
  @Cron('0 7 * * 0')
  async handleWeeklyNotifications() {
    const users = await this.getUsersWithPreference(Frequency.WEEKLY); // Use the Frequency enum
    for (const user of users) {
      await this.recommendationService.generateRecommendations(user.id);
    }
  }

  // Get users with a specific preference
  private async getUsersWithPreference(frequency: Frequency) { // Change the type of frequency to Frequency
    return this.prisma.user.findMany({
      where: {
        notificationPreference: {
          frequency,
        },
      },
    });
  }
}

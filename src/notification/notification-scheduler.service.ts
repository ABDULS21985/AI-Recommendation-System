// src/notification/notification-scheduler.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RecommendationService } from '../recommendation/recommendation.service';
import { Frequency } from '@prisma/client';

@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(NotificationSchedulerService.name); // Initialize Logger

  constructor(
    private prisma: PrismaService,
    private recommendationService: RecommendationService,
  ) {}

  // Run this every day at 7AM
  @Cron('0 7 * * *')
  async handleDailyNotifications() {
    this.logger.log('Starting daily notification cron job');
    try {
      const users = await this.getUsersWithPreference(Frequency.DAILY);
      const domain = 'amazon.com'; // Default domain for daily notifications
      for (const user of users) {
        await this.recommendationService.generateRecommendations(user.id, domain);
      }
      this.logger.log('Daily notification cron job completed successfully');
    } catch (error) {
      this.logger.error('Error occurred during daily notification cron job', error.stack);
    }
  }

  // Run this every Sunday at 7AM
  @Cron('0 7 * * 0')
  async handleWeeklyNotifications() {
    this.logger.log('Starting weekly notification cron job');
    try {
      const users = await this.getUsersWithPreference(Frequency.WEEKLY);
      const domain = 'netflix.com'; // Default domain for weekly notifications
      for (const user of users) {
        await this.recommendationService.generateRecommendations(user.id, domain);
      }
      this.logger.log('Weekly notification cron job completed successfully');
    } catch (error) {
      this.logger.error('Error occurred during weekly notification cron job', error.stack);
    }
  }

  private async getUsersWithPreference(frequency: Frequency) {
    return this.prisma.user.findMany({
      where: {
        notificationPreference: {
          frequency,
        },
      },
    });
  }
}

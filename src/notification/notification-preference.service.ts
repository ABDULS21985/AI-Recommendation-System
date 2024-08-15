import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';

@Injectable()
export class NotificationPreferenceService {
  private readonly logger = new Logger(NotificationPreferenceService.name); // Initialize Logger

  constructor(private prisma: PrismaService) {}

  async updatePreference(data: UpdateNotificationPreferenceDto) {
    this.logger.log(`Updating notification preference for user ${data.userId}`);
    try {
      const preference = await this.prisma.notificationPreference.upsert({
        where: { userId: data.userId },
        update: { frequency: data.frequency },
        create: { userId: data.userId, frequency: data.frequency },
      });
      this.logger.log(`Successfully updated notification preference for user ${data.userId}`);
      return preference;
    } catch (error) {
      this.logger.error(`Failed to update notification preference for user ${data.userId}`, error.stack);
      throw error;
    }
  }

  async getPreference(userId: string) {
    this.logger.log(`Fetching notification preference for user ${userId}`);
    try {
      const preference = await this.prisma.notificationPreference.findUnique({
        where: { userId },
      });
      if (preference) {
        this.logger.log(`Successfully retrieved notification preference for user ${userId}`);
        return preference;
      } else {
        this.logger.warn(`No notification preference found for user ${userId}`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Failed to retrieve notification preference for user ${userId}`, error.stack);
      throw error;
    }
  }
}

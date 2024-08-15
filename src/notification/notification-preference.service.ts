// src/notification/notification-preference.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';

@Injectable()
export class NotificationPreferenceService {
  constructor(private prisma: PrismaService) {}

  async updatePreference(data: UpdateNotificationPreferenceDto) {
    return this.prisma.notificationPreference.upsert({
      where: { userId: data.userId },
      update: { frequency: data.frequency },
      create: { userId: data.userId, frequency: data.frequency },
    });
  }

  async getPreference(userId: string) {
    return this.prisma.notificationPreference.findUnique({
      where: { userId },
    });
  }
}

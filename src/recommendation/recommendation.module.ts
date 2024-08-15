// src/recommendation/recommendation.module.ts
import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailService } from '../notification/email.service';
import { NotificationPreferenceService } from '../notification/notification-preference.service';

@Module({
  imports: [PrismaModule],
  controllers: [RecommendationController],
  providers: [RecommendationService, EmailService, NotificationPreferenceService],
})
export class RecommendationModule {}

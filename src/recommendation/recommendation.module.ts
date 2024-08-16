// src/recommendation/recommendation.module.ts
import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailService } from '../notification/email.service';
import { NotificationPreferenceService } from '../notification/notification-preference.service';
import { RecommendationsGateway } from './recommendations.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [RecommendationController],
  providers: [RecommendationService, EmailService, NotificationPreferenceService, RecommendationsGateway],
})
export class RecommendationModule {}

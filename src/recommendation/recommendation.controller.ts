// src/recommendation/recommendation.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get(':userId')
  getRecommendationsForUser(@Param('userId') userId: string) {
    return this.recommendationService.getRecommendationsForUser(userId);
  }

  @Get('generate/:userId')
  generateRecommendations(@Param('userId') userId: string) {
    return this.recommendationService.generateRecommendations(userId);
  }
}

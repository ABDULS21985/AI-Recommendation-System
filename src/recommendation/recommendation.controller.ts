import { Controller, Get, Param, Logger } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserIdParamDto } from './dto/user-id-param.dto';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('recommendations')
@ApiTags('Recommendations')
export class RecommendationController {
  private readonly logger = new Logger(RecommendationController.name); // Initialize Logger

  constructor(private readonly recommendationService: RecommendationService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get recommendations for a user' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved recommendations.' })
  async getRecommendationsForUser(@Param('userId', new ParseUUIDPipe()) userId: string) {
    this.logger.log(`Received request to get recommendations for user: ${userId}`);
    try {
      const recommendations = await this.recommendationService.getRecommendationsForUser(userId);
      this.logger.log(`Successfully retrieved recommendations for user: ${userId}`);
      return recommendations;
    } catch (error) {
      this.logger.error(`Failed to retrieve recommendations for user: ${userId}`, error.stack);
      throw error;
    }
  }

  @Get('generate/:userId')
  @ApiOperation({ summary: 'Generate new recommendations for a user' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiResponse({ status: 201, description: 'Recommendations successfully generated.' })
  async generateRecommendations(@Param('userId', new ParseUUIDPipe()) userId: string) {
    this.logger.log(`Received request to generate recommendations for user: ${userId}`);
    try {
      const recommendations = await this.recommendationService.generateRecommendations(userId);
      this.logger.log(`Successfully generated recommendations for user: ${userId}`);
      return recommendations;
    } catch (error) {
      this.logger.error(`Failed to generate recommendations for user: ${userId}`, error.stack);
      throw error;
    }
  }
}

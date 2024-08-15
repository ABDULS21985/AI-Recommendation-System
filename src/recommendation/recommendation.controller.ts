import { Controller, Get, Param, Logger, Query } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('recommendations')
@ApiTags('Recommendations')
export class RecommendationController {
  private readonly logger = new Logger(RecommendationController.name); // Initialize Logger

  constructor(private readonly recommendationService: RecommendationService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get recommendations for a user' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiQuery({ name: 'domain', required: true, description: 'The domain of recommendations (e-commerce, entertainment, content)' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved recommendations.' })
  async getRecommendationsForUser(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Query('domain') domain: string,
  ) {
    this.logger.log(`Received request to get recommendations for user: ${userId} in domain: ${domain}`);
    try {
      const recommendations = await this.recommendationService.getRecommendationsForUser(userId, domain);
      this.logger.log(`Successfully retrieved recommendations for user: ${userId} in domain: ${domain}`);
      return recommendations;
    } catch (error) {
      this.logger.error(`Failed to retrieve recommendations for user: ${userId} in domain: ${domain}`, error.stack);
      throw error;
    }
  }

  @Get('generate/:userId/:domain')
  @ApiOperation({ summary: 'Generate new recommendations for a user' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiQuery({ name: 'domain', required: true, description: 'The domain to generate recommendations for (e-commerce, entertainment, content)' })
  @ApiResponse({ status: 201, description: 'Recommendations successfully generated.' })
  async generateRecommendations(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Query('domain') domain: string,
  ) {
    this.logger.log(`Received request to generate recommendations for user: ${userId} in domain: ${domain}`);
    try {
      const recommendations = await this.recommendationService.generateRecommendations(userId, domain);
      this.logger.log(`Successfully generated recommendations for user: ${userId} in domain: ${domain}`);
      return recommendations;
    } catch (error) {
      this.logger.error(`Failed to generate recommendations for user: ${userId} in domain: ${domain}`, error.stack);
      throw error;
    }
  }
}

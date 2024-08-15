import { Controller, Get, Param } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserIdParamDto } from './dto/user-id-param.dto';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('recommendations')
@ApiTags('Recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get recommendations for a user' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved recommendations.' })
  getRecommendationsForUser(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.recommendationService.getRecommendationsForUser(userId);
  }

  @Get('generate/:userId')
  @ApiOperation({ summary: 'Generate new recommendations for a user' })
  @ApiParam({ name: 'userId', description: 'The ID of the user' })
  @ApiResponse({ status: 201, description: 'Recommendations successfully generated.' })
  generateRecommendations(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.recommendationService.generateRecommendations(userId);
  }
}

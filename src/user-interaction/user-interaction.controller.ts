import { Controller, Post, Get, Param, Body, Logger } from '@nestjs/common';
import { UserInteractionService } from './user-interaction.service';
import { CreateUserInteractionDto } from './dto/create-user-interaction.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LikeItemDto } from './dto/like-item.dto';
import { RateItemDto } from './dto/rate-item.dto';

@Controller('interactions')
@ApiTags('User Interactions')
export class UserInteractionController {
  private readonly logger = new Logger(UserInteractionController.name); // Initialize Logger

  constructor(private readonly interactionService: UserInteractionService) {}

  @Post()
  @ApiOperation({ summary: 'Log a user interaction' })
  @ApiResponse({ status: 201, description: 'User interaction successfully logged.' })
  @ApiBody({
    description: 'The payload for logging a user interaction',
    type: CreateUserInteractionDto,
    examples: {
      example1: {
        summary: 'Sample interaction payload',
        value: {
          userId: '7c0e9d85-b499-435b-8a92-5c9d17cc56a2',
          itemId: '1d2e9f85-d499-43e5-bd65-3f9b17dd25a2',
          interactionType: 'view',
          rating: 5,
        },
      },
    },
  })
  async logInteraction(@Body() data: CreateUserInteractionDto) {
    this.logger.log(`Logging interaction for user ${data.userId} on item ${data.itemId}`);
    try {
      const interaction = await this.interactionService.logInteraction(data);
      this.logger.log(`Successfully logged interaction for user ${data.userId}`);
      return interaction;
    } catch (error) {
      this.logger.error(`Failed to log interaction for user ${data.userId}`, error.stack);
      throw error;
    }
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user interactions by userId' })
  @ApiResponse({ status: 200, description: 'User interactions retrieved successfully.' })
  async getUserInteractions(@Param('userId') userId: string) {
    this.logger.log(`Fetching interactions for user ${userId}`);
    try {
      const interactions = await this.interactionService.getUserInteractions(userId);
      this.logger.log(`Successfully fetched interactions for user ${userId}`);
      return interactions;
    } catch (error) {
      this.logger.error(`Failed to fetch interactions for user ${userId}`, error.stack);
      throw error;
    }
  }

  @Post('like')
  @ApiOperation({ summary: 'Like or Dislike an item' })
  async likeItem(@Body() likeItemDto: LikeItemDto) {
    const { userId, itemId, like } = likeItemDto;
    this.logger.log(`User ${userId} is ${like ? 'liking' : 'disliking'} item ${itemId}`);
    try {
      const result = await this.interactionService.likeItem(userId, itemId, like);
      this.logger.log(`Successfully processed like/dislike for user ${userId} on item ${itemId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to process like/dislike for user ${userId} on item ${itemId}`, error.stack);
      throw error;
    }
  }

  @Post('rate')
  @ApiOperation({ summary: 'Rate an item' })
  async rateItem(@Body() rateItemDto: RateItemDto) {
    const { userId, itemId, rating } = rateItemDto;
    this.logger.log(`User ${userId} is rating item ${itemId} with ${rating} stars`);
    try {
      const result = await this.interactionService.rateItem(userId, itemId, rating);
      this.logger.log(`Successfully processed rating for user ${userId} on item ${itemId}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to process rating for user ${userId} on item ${itemId}`, error.stack);
      throw error;
    }
  }
}

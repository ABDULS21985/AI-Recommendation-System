// src/userInteraction/user-interaction.controller.ts
import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { UserInteractionService } from './user-interaction.service';
import { CreateUserInteractionDto } from './dto/create-user-interaction.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('interactions')
@ApiTags('User Interactions')
export class UserInteractionController {
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
  logInteraction(@Body() data: CreateUserInteractionDto) {
    return this.interactionService.logInteraction(data);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user interactions by userId' })
  @ApiResponse({ status: 200, description: 'User interactions retrieved successfully.' })
  getUserInteractions(@Param('userId') userId: string) {
    return this.interactionService.getUserInteractions(userId);
  }
}

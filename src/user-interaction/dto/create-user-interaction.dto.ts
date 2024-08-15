// src/userInteraction/dto/create-user-interaction.dto.ts
import { IsEnum, IsOptional, IsString, IsInt, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InteractionType } from '@prisma/client';

export class CreateUserInteractionDto {
  @ApiProperty({ description: 'The ID of the user', example: '7c0e9d85-b499-435b-8a92-5c9d17cc56a2' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'The ID of the item', example: '1d2e9f85-d499-43e5-bd65-3f9b17dd25a2' })
  @IsUUID()
  itemId: string;

  @ApiProperty({ description: 'The type of interaction', example: 'view', enum: InteractionType })
  @IsEnum(InteractionType)
  interactionType: InteractionType;

  @ApiProperty({ description: 'The rating given by the user (optional)', example: 5, required: false })
  @IsOptional()
  @IsInt()
  rating?: number;

  @ApiProperty({ description: 'Whether the item is liked by the user (optional)', example: true, required: false })
  @IsOptional()
  @IsInt()
  like?: boolean;
}

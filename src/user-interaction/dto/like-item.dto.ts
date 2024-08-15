// src/userInteraction/dto/like-item.dto.ts
import { IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LikeItemDto {
  @ApiProperty({ description: 'The ID of the user', example: '7c0e9d85-b499-435b-8a92-5c9d17cc56a2' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'The ID of the item', example: '1d2e9f85-d499-43e5-bd65-3f9b17dd25a2' })
  @IsUUID()
  itemId: string;

  @ApiProperty({ description: 'True for like, false for dislike', example: true })
  @IsBoolean()
  like: boolean;
}

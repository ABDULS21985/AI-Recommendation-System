// src/userInteraction/dto/rate-item.dto.ts
import { IsInt, IsUUID, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RateItemDto {
  @ApiProperty({ description: 'The ID of the user', example: '7c0e9d85-b499-435b-8a92-5c9d17cc56a2' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'The ID of the item', example: '1d2e9f85-d499-43e5-bd65-3f9b17dd25a2' })
  @IsUUID()
  itemId: string;

  @ApiProperty({ description: 'Rating value between 1 and 5', example: 4 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}

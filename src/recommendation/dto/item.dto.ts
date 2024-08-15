// src/recommendation/dto/item.dto.ts
import { IsBoolean, IsOptional, IsInt, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ItemDto {
  @ApiProperty({ example: '1d2e9f85-d499-43e5-bd65-3f9b17dd25a2' })
  @IsUUID()
  itemId: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  like: boolean;

  @ApiProperty({ example: 5 })
  @IsOptional()
  @IsInt()
  rating?: number;
}

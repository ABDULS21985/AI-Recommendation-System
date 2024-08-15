// src/item/dto/create-item.dto.ts
import { IsEnum, IsString, IsOptional, IsJSON } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ItemType {
  PRODUCT = 'product',
  VIDEO = 'video',
  CONTENT = 'content',
}

export class CreateItemDto {
  @ApiProperty({ example: 'Product Title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'This is a description of the product.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'product', enum: ItemType })
  @IsEnum(ItemType)
  type: ItemType;

  @ApiProperty({ example: '{"price": 100, "color": "red"}' })
  @IsOptional()
  @IsJSON()
  metadata?: string;
}

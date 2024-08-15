// src/item/item.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('items')
@ApiTags('Items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'Item successfully created.' })
  @ApiBody({
    description: 'The payload for creating a new item',
    type: CreateItemDto,
    examples: {
      example1: {
        summary: 'Sample item payload',
        value: {
          title: 'Product Title',
          description: 'This is a description of the product.',
          type: 'product',
          metadata: '{"price": 100, "color": "red"}',
        },
      },
    },
  })
  createItem(@Body() data: CreateItemDto) {
    return this.itemService.createItem(data);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all items' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved items.' })
  getItems() {
    return this.itemService.getItems();
  }
}

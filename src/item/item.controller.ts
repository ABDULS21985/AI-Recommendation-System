import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('items')
@ApiTags('Items')
export class ItemController {
  private readonly logger = new Logger(ItemController.name); // Initialize Logger

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
  async createItem(@Body() data: CreateItemDto) {
    this.logger.log(`Creating a new item with title: ${data.title}`);
    try {
      const item = await this.itemService.createItem(data);
      this.logger.log(`Item successfully created with ID: ${item.id}`);
      return item;
    } catch (error) {
      this.logger.error(`Failed to create item with title: ${data.title}`, error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all items' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved items.' })
  async getItems() {
    this.logger.log('Retrieving all items');
    try {
      const items = await this.itemService.getItems();
      this.logger.log(`Successfully retrieved ${items.length} items`);
      return items;
    } catch (error) {
      this.logger.error('Failed to retrieve items', error.stack);
      throw error;
    }
  }
}

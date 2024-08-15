import { Controller, Get, Post, Body, Query, Logger } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@Controller('items')
@ApiTags('Items')
export class ItemController {
  private readonly logger = new Logger(ItemController.name); // Initialize Logger

  constructor(private readonly itemService: ItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'Item successfully created.' })
  async createItem(@Body() data: CreateItemDto) {
    this.logger.log(`Received request to create an item with title: ${data.title}`);
    
    try {
      const item = await this.itemService.createItem(data);
      this.logger.log(`Item creation successful with ID: ${item.id}`);
      return item;
    } catch (error) {
      this.logger.error(`Failed to create item with title: ${data.title}`, error.stack);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all items with optional filtering, search, and pagination' })
  @ApiQuery({ name: 'title', required: false, description: 'Search by item title' })
  @ApiQuery({ name: 'description', required: false, description: 'Search by item description' })
  @ApiQuery({ name: 'price', required: false, description: 'Filter by item price' })
  @ApiQuery({ name: 'color', required: false, description: 'Filter by item color' })
  @ApiQuery({ name: 'skip', required: false, description: 'Skip items for pagination', example: 0 })
  @ApiQuery({ name: 'take', required: false, description: 'Limit items for pagination', example: 10 })
  @ApiResponse({ status: 200, description: 'Successfully retrieved items.' })
  async getItems(
    @Query('title') title?: string,
    @Query('description') description?: string,
    @Query('price') price?: number,
    @Query('color') color?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    this.logger.log('Received request to retrieve items with filters');
    
    const filters = { title, description, price: price ? Number(price) : undefined, color, skip: skip ? Number(skip) : 0, take: take ? Number(take) : 10 };
    
    try {
      const items = await this.itemService.getItems(filters);
      this.logger.log(`Successfully retrieved ${items.length} items`);
      return items;
    } catch (error) {
      this.logger.error('Failed to retrieve items', error.stack);
      throw error;
    }
  }
}

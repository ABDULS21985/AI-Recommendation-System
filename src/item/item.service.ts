import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name); // Initialize Logger

  constructor(private prisma: PrismaService) {}

  async createItem(data: CreateItemDto) {
    this.logger.log(`Creating an item with title: ${data.title}`);

    try {
      // Transform CreateItemDto to match Prisma's ItemCreateInput
      const itemData: Prisma.ItemCreateInput = {
        title: data.title,
        description: data.description,
        type: data.type,
        metadata: data.metadata ? JSON.parse(data.metadata) : {}, // Handle metadata
      };

      const item = await this.prisma.item.create({ data: itemData });
      this.logger.log(`Item successfully created with ID: ${item.id}`);
      return item;
    } catch (error) {
      this.logger.error(`Failed to create item with title: ${data.title}`, error.stack);
      throw error;
    }
  }

  async getItems() {
    this.logger.log('Retrieving all items');
    try {
      const items = await this.prisma.item.findMany();
      this.logger.log(`Successfully retrieved ${items.length} items`);
      return items;
    } catch (error) {
      this.logger.error('Failed to retrieve items', error.stack);
      throw error;
    }
  }
}

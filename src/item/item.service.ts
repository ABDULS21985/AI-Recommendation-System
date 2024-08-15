import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name); // Initialize Logger

  constructor(private prisma: PrismaService) {}

  async createItem(data: CreateItemDto) {
    this.logger.log(`Creating a new item with title: ${data.title}`);
    
    try {
      const itemData: Prisma.ItemCreateInput = {
        title: data.title,
        description: data.description,
        type: data.type,
        metadata: data.metadata ? JSON.parse(data.metadata) : {},
      };

      const item = await this.prisma.item.create({ data: itemData });
      this.logger.log(`Item created successfully with ID: ${item.id}`);
      return item;
    } catch (error) {
      this.logger.error(`Failed to create item with title: ${data.title}`, error.stack);
      throw error;
    }
  }

  async getItems(filters: { 
    title?: string; 
    description?: string; 
    price?: number; 
    color?: string; 
    skip?: number; 
    take?: number 
  }) {
    this.logger.log(`Retrieving items with filters: ${JSON.stringify(filters)}`);
    
    try {
      const { title, description, price, color, skip, take } = filters;

      const where: Prisma.ItemWhereInput = {
        title: title ? { contains: title, mode: 'insensitive' } : undefined,
        description: description ? { contains: description, mode: 'insensitive' } : undefined,
        metadata: price ? { path: ['price'], equals: price } : undefined,
        AND: color ? [{ metadata: { path: ['color'], equals: color } }] : undefined,
      };

      const items = await this.prisma.item.findMany({
        where,
        skip: skip || 0,
        take: take || 10,
      });
      
      this.logger.log(`Successfully retrieved ${items.length} items`);
      return items;
    } catch (error) {
      this.logger.error('Failed to retrieve items', error.stack);
      throw error;
    }
  }
}

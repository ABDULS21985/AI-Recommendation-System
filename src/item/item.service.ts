// src/item/item.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async createItem(data: CreateItemDto) {
    // Transform CreateItemDto to match Prisma's ItemCreateInput
    const itemData: Prisma.ItemCreateInput = {
      title: data.title,
      description: data.description,
      type: data.type,
      // Handle the metadata field, either parsing the provided JSON or using an empty object as default
      metadata: data.metadata ? JSON.parse(data.metadata) : {},
    };

    return this.prisma.item.create({ data: itemData });
  }

  async getItems() {
    return this.prisma.item.findMany();
  }
}

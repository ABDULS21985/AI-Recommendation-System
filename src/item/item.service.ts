// src/item/item.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  async createItem(data: any) {
    return this.prisma.item.create({ data });
  }

  async getItems() {
    return this.prisma.item.findMany();
  }
}

// src/item/item.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { ItemService } from './item.service';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  createItem(@Body() data: any) {
    return this.itemService.createItem(data);
  }

  @Get()
  getItems() {
    return this.itemService.getItems();
  }
}

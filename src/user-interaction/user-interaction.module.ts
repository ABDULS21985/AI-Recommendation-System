import { Module } from '@nestjs/common';
import { UserInteractionService } from './user-interaction.service';
import { UserInteractionController } from './user-interaction.controller';
import { PrismaService } from '../prisma/prisma.service';


@Module({
  controllers: [UserInteractionController],
  providers: [UserInteractionService, PrismaService],
})
export class UserInteractionModule {}

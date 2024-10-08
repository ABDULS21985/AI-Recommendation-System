import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { ItemModule } from './item/item.module';
import { UserModule } from './user/user.module';
import { UserInteractionModule } from './user-interaction/user-interaction.module';
import { MetricsModule } from './metrics/metrics.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [PrismaModule, RecommendationModule, ItemModule, UserModule, UserInteractionModule, MetricsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { PrometheusModule, makeCounterProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [PrometheusModule.register()],
  providers: [
    MetricsService,
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total HTTP requests',
      labelNames: ['method', 'path'],
    }),
  ],
  exports: [MetricsService],
})
export class MetricsModule {}

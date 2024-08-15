import { Controller, Get } from '@nestjs/common';
import { Registry } from 'prom-client';

@Controller('metrics')
export class MetricsController {
  constructor(private registry: Registry) {}

  @Get()
  getMetrics() {
    return this.registry.metrics();
  }
}

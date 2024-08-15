import { Injectable } from '@nestjs/common';
import { Counter } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class MetricsService {
  constructor(
    @InjectMetric('http_requests_total') private readonly httpRequestsTotal: Counter<string>,
  ) {}

  // Example: Increment a counter
  public recordHttpRequest() {
    this.httpRequestsTotal.inc();
  }
}

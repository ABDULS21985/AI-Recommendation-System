// src/recommendations/recommendations.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'ws';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway()
@Injectable()
export class RecommendationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RecommendationsGateway.name);
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log('Client connected');
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected');
  }

  sendRecommendationUpdate(userId: string, recommendation: any) {
    this.server.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ userId, recommendation }));
      }
    });
  }
}

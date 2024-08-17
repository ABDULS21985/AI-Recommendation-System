import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'ws';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: '/recommendations' }) // Using namespace for recommendations
@Injectable()
export class RecommendationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RecommendationsGateway.name);

  @WebSocketServer() server: Server;

  private clientToUserMap: Map<Socket, string> = new Map(); // Map clients to user IDs

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log('Client connected');
    
    // Assume the client sends userId as a part of the initial connection handshake
    client.on('message', (message) => {
      const data = JSON.parse(message.toString());
      if (data && data.userId) {
        this.clientToUserMap.set(client, data.userId);
        this.logger.log(`User with ID ${data.userId} connected`);
      }
    });
  }

  handleDisconnect(client: Socket) {
    const userId = this.clientToUserMap.get(client);
    if (userId) {
      this.logger.log(`User with ID ${userId} disconnected`);
      this.clientToUserMap.delete(client);
    } else {
      this.logger.log('Unknown client disconnected');
    }
  }

  @SubscribeMessage('requestRecommendations')
  handleRequestRecommendations(@MessageBody() data: { userId: string }) {
    this.logger.log(`Received recommendation request for user ID: ${data.userId}`);
    // This method can trigger a recommendation generation or retrieval logic.
  }

  sendRecommendationUpdate(userId: string, recommendation: any) {
    this.server.clients.forEach(client => {
      const clientUserId = this.clientToUserMap.get(client);
      if (client.readyState === client.OPEN && clientUserId === userId) {
        client.send(JSON.stringify({ recommendation }));
      }
    });
  }
}

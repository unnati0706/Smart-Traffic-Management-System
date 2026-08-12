import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`WebSocket client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`WebSocket client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    return { event: 'joinedRoom', data: room };
  }

  // Broadcasters for system domain events per spec §23
  broadcastTrafficUpdate(data: any) {
    this.server?.emit('traffic.updated', data);
  }

  broadcastIncidentCreated(data: any) {
    this.server?.emit('incident.created', data);
  }

  broadcastIncidentUpdated(data: any) {
    this.server?.emit('incident.updated', data);
  }

  broadcastEmergencyVehicleUpdated(data: any) {
    this.server?.emit('emergency.vehicle.updated', data);
  }

  broadcastPredictionUpdated(data: any) {
    this.server?.emit('prediction.updated', data);
  }

  broadcastSignalRecommendationCreated(data: any) {
    this.server?.emit('signal.recommendation.created', data);
  }

  broadcastSimulationCompleted(data: any) {
    this.server?.emit('simulation.completed', data);
  }

  broadcastAlert(data: any) {
    this.server?.emit('alert.created', data);
  }
}

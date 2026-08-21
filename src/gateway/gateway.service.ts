import { Injectable } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class GatewayService {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage("message")
    handleMessage(@MessageBody()payload:any,client: Socket): void {
        this.server.emit('message', payload);
    }
}

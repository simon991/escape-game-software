import { createServer, Server } from 'http';
import * as socketIo from 'socket.io';

import { Message } from './model';

export class SocketServer {
  public static readonly PORT:number = 8080;
  private server: Server;
  private io: socketIo.Server;
  private port: string | number;

  constructor() {
    this.config();
    this.createServer();
    this.sockets();
    this.listen();
  }

  private createServer(): void {
    this.server = createServer();
  }

  private config(): void {
    this.port = process.env.PORT || SocketServer.PORT;
  }

  private sockets(): void {
    this.io = socketIo(this.server);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on('connect', (socket: any) => {
      console.log('Connected client on port %s.', this.port);
      socket.on('message', (m: Message) => {
        console.log('[server](message): %s', JSON.stringify(m));
        this.io.emit('message', m);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }
}

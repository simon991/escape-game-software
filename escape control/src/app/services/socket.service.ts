import {Injectable, OnInit} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Message } from '../model/message';
import { Event } from '../model/event';
import * as os from 'os';

import * as socketIo from 'socket.io-client';

const SERVER_PORT = '8080';

@Injectable()
export class SocketService {


  private socket;

  public initSocket(socketServerIpAdress:string): void {
    this.socket = socketIo("http://" + socketServerIpAdress + ":" + SERVER_PORT);
  }

  public sendCountdownTime(timeInMinutes) {
    console.log("settime: " +  timeInMinutes);
    this.socket.emit('settime', timeInMinutes);
  }

  public send(message: Message): void {
    this.socket.emit('message', message);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }

  public sendStartCountdown() {
    console.log("Start countdown");
    this.socket.emit('startCountdown', true);
  }

  public sendPauseCountdown() {
    console.log("Pause countdown");
    this.socket.emit('pauseCountdown', true);
  }

  public sendResetCountdown() {
    console.log("Reset countdown");
    this.socket.emit('resetCountdown', true);
  }

  public sendMessageToRoom(textMessage: string) {
    console.log("Send message to room: " + textMessage);
    this.socket.emit('textMessage', textMessage);
  }
}

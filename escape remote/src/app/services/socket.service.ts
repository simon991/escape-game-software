import {Injectable, OnInit} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Message } from '../model/message';
import { Event } from '../model/event';
import * as os from 'os';

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:8080';

@Injectable()
export class SocketService {


  private socket;

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }

  public send(message: Message): void {
    this.socket.emit('message', message);
  }

  public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
      this.socket.on('message', (data: Message) => observer.next(data));
    });
  }

  public onTextMessage(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('textMessage', (data: string) => observer.next(data));
    });
  }

  public onSetTime(): Observable<number> {
    return new Observable<number>(observer => {
      this.socket.on('settime', (data: number) => observer.next(data));
    });
  }

  public onCountdownStart(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.socket.on('startCountdown', (data: boolean) => observer.next(data));
    });
  }

  public onCountdownPause(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.socket.on('pauseCountdown', (data: boolean) => observer.next(data));
    });
  }

  public onCountdownReset(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.socket.on('resetCountdown', (data: boolean) => observer.next(data));
    });
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}

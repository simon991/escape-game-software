import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/do';
import { SocketService } from './services/socket.service';
import {Message} from "./model/message";
import {Event} from "./model/event"



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public socketServerIpAdress:string = "";
  public countdownMinutes:number = 60;
  public textMessage:string = "";

  constructor(private socketService: SocketService) { }


  ngOnInit(): void {

  }


  public initIoConnection(): void {
    this.socketService.initSocket(this.socketServerIpAdress);

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  public sendMessageToRoom(): void {
    this.socketService.sendMessageToRoom(this.textMessage);
    this.textMessage = "";
  }

  public sendCountdownTime(): void {
    this.socketService.sendCountdownTime(this.countdownMinutes);
  }

  public startCountdown(): void {
    this.socketService.sendStartCountdown();
  }

  public pauseCountdown(): void {
    this.socketService.sendPauseCountdown();
  }

  public resetCountdown(): void {
    this.socketService.sendResetCountdown();
  }

}

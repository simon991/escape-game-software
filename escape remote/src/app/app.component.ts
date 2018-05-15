import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/do';
import { timer } from 'rxjs/observable/timer';
import { SocketService } from './services/socket.service';
import {Message} from "./model/message";
import {Event} from "./model/event"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public countdownMinutes:number = 60;
  public currentMinutes:number = 60;
  public currentSeconds:number = 0;
  public textMessage:string = "";


  messages: Message[] = [];
  ioConnection: any;

  constructor(private socketService: SocketService) { }


  ngOnInit(): void {
    this.initIoConnection();
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });

    this.socketService.onSetTime()
      .subscribe((timerTime: number) => {
        console.log("New time: " + timerTime);
        this.countdownMinutes = timerTime;
        this.currentMinutes = timerTime;
        this.reset();
      });

    this.socketService.onCountdownReset()
      .subscribe((data: boolean) => {
        console.log("Countdown reset");
        this.reset();
      });

    this.socketService.onCountdownStart()
      .subscribe((data: boolean) => {
        console.log("Countdown start");
        this.start();
      });

    this.socketService.onCountdownPause()
      .subscribe((data: boolean) => {
        console.log("Countdown pause");
        this.pause();
      });

    this.socketService.onTextMessage()
      .subscribe((data: string) => {
        console.log("Text message arrived: " + data);
        this.textMessage = data;
        //emit 0 after 1 second then complete, since no second argument is supplied
        timer(10000).subscribe(val => this.textMessage = "");
      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  private timerPause = true;
  start() {
    this.timerPause = false;
    const interval = Observable.interval(1000);

    interval
      .takeWhile(_ => !this.isFinished && !this.timerPause)
      .do(i => {
        if (this.currentSeconds == 0) {this.currentMinutes--;this.currentSeconds=60;}
        this.currentSeconds--;
      })
      .subscribe();
  }

  pause() {
    this.timerPause = true;
  }

  /// reset timer
  reset() {
    this.currentMinutes = this.countdownMinutes;
    this.currentSeconds = 0;
  }

  get isFinished() {
    if (this.currentMinutes <= 0 && this.currentSeconds == 0) {
      this.pause();
      this.reset();
      return true;
    } else  {
      return false;
    }
  }



}

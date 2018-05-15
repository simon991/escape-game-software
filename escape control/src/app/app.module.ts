import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms'; // <-- here
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import {SocketService} from "./services/socket.service"; // <-- here

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, // <-- here
    RoundProgressModule // <-- and here
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }

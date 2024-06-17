import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Theatre} from "../../global";

@Component({
  selector: 'app-theatre-notification',
  standalone: true,
  imports: [],
  templateUrl: './theatre-notification.component.html',
  styleUrl: './theatre-notification.component.css'
})
export class TheatreNotificationComponent implements AfterViewInit {
  @Input() theatre!: Theatre;
  addTime: string;

  constructor() {
    this.addTime = this.formatTime(new Date())
  }




  formatTime(date: Date): string {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // Pad minutes with leading zero if necessary
    const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();

    // Pad hours with leading zero if necessary (if required)
    const hoursStr = hours < 10 ? '0' + hours : hours.toString();

    return hoursStr + ':' + minutesStr + ' ' + ampm;
  }

  ngAfterViewInit(): void {
  }



}

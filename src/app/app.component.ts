import {AfterViewInit, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgClass} from "@angular/common";
import {WsService} from "../services/ws/ws.service";
import {ConnectionStatus, Theatre} from "../global";
import {TheatreNotificationComponent} from "./theatre-notification/theatre-notification.component";
import {count} from "rxjs";
import {Howl} from "howler";




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass, TheatreNotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'movieweb';


  connectionStatus: ConnectionStatus = 'INACTIVE';
  bookingChannelStatus: ConnectionStatus = 'INACTIVE';
  subscriber_count : number = 0;

  constructor(private wsService: WsService, private resolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {

    this.wsService.connectionStatus$.subscribe((status: ConnectionStatus) => {
      if(status === this.connectionStatus) {}
      else if (status=== 'ACTIVE') {
        this.wsService.subscribeToChannel('SubscriberCountChannel')
        this.wsService.subscribeToChannel('BookingChannel')

        // this.wsService.callChannelMethod('SubscriberCountChannel', 'get_count', null)
      }
      this.connectionStatus = status;
    });

    this.wsService.bookingChannelSubStatus$.subscribe((status: ConnectionStatus) => {
      this.bookingChannelStatus = status;
    });

    this.wsService.countChannelSubStatus$.subscribe((count: number) => {
      this.subscriber_count = count;
    });

    this.wsService.notification.subscribe((message: string) => {
      this.createNotification(message)
    });

    console.log('Status: ', this.connectionStatus);
    if (this.connectionStatus=='INACTIVE') {
      this.wsService.connect()
    }

  }




  get status():ConnectionStatus{
    if (this.connectionStatus == 'ACTIVE' && this.bookingChannelStatus == 'ACTIVE') {
      this.playSound()

      return this.bookingChannelStatus
    }
    else
      return this.connectionStatus
    }



  @ViewChild('notifications', { read: ViewContainerRef }) notificationsContainer!: ViewContainerRef;


  createNotification(message: any) {
  console.log(message)
    this.playSound()

    if (this.notificationsContainer) {}
    const theatre: Theatre = {
      type: message.type,
      name: message.theatre,
      link: message.link,
      shows: message.shows
    };

    console.log(this.notificationsContainer == null)
    const componentRef = this.notificationsContainer.createComponent(TheatreNotificationComponent);
    componentRef.instance.theatre = theatre;
  }

   playSound() {
    // var sound = new Howl({
    //   src: ['assets/5starbounty.mp3']
    // });
    //
    // sound.play();
  }


}

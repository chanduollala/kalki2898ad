import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {ChannelName, ConnectionStatus, wsUrl} from "../../global";

@Injectable({
  providedIn: 'root'
})
export class WsService {
  private socket: WebSocket | undefined;

  private connectionStatusSubject: Subject<ConnectionStatus> = new Subject<ConnectionStatus>();
  connectionStatus$ = this.connectionStatusSubject.asObservable();

  private bookingChannelSubStatusSubject: Subject<ConnectionStatus> = new Subject<ConnectionStatus>();
  bookingChannelSubStatus$  = this.bookingChannelSubStatusSubject.asObservable()

  private subscriberCountSubject: Subject<number> = new Subject<number>();
  countChannelSubStatus$  = this.subscriberCountSubject.asObservable()

  private notificationSubject: Subject<any> = new Subject<any>();
  notification = this.notificationSubject.asObservable()

  connect() {
    this.bookingChannelSubStatusSubject.next('INACTIVE');

    console.log('Connecting to ws service...');
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      this.connectionStatusSubject.next('ACTIVE');
      console.log('Connected to ws service');
    };

    this.socket.onclose = () => {
      console.log('Unable to establish connection')

      this.connectionStatusSubject.next('INACTIVE');
      this.bookingChannelSubStatusSubject.next('INACTIVE');
      this.subscriberCountSubject.next(0);
    };

    this.socket.onmessage = (message) => {
      // Handle incoming message
      const data = JSON.parse(message.data);

      // Filter out ping messages
      if (data.type === 'ping') {
        return;
      }

      if (data.type === 'confirm_subscription') {
        console.log(data.identifier)
        if (JSON.parse(data.identifier).channel === 'BookingChannel') {
          this.bookingChannelSubStatusSubject.next('ACTIVE');
          console.log('Subscribed to bookings channel');
        }
        else if (JSON.parse(data.identifier).channel === 'SubscriberCountChannel') {
          console.log('Subscribed to Subcriber Count channel');
        }
      }


      if (data.message) {
        if (JSON.parse(data.identifier).channel === 'BookingChannel') {
          console.log('Message in bookings channel', data.message);
          this.notificationSubject.next(data.message)

        }
        else if (JSON.parse(data.identifier).channel === 'SubscriberCountChannel') {
          this.subscriberCountSubject.next(data.message)
          console.log('Subcriber Count : ', data.message);
        }
      }

    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.bookingChannelSubStatusSubject.next('INACTIVE');
      this.subscriberCountSubject.next(0);
      this.connectionStatusSubject.next('INACTIVE');
    };

    this.connectionStatusSubject.next('CONNECTING');
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket is not open. Cannot send message.');
    }
  }

  subscribeToChannel(channelName: ChannelName) {

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const subscriptionMessage = {
        command: 'subscribe',
        identifier: JSON.stringify({
          channel: channelName // Replace with your actual channel name
        })
      };
      this.bookingChannelSubStatusSubject.next('CONNECTING')
      this.socket.send(JSON.stringify(subscriptionMessage));
    }
  }

  callChannelMethod(channelName: ChannelName, action: string, message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const performMessage = {
        command: 'message',
        identifier: JSON.stringify({
          channel: channelName
        }),
        data: JSON.stringify({
          action: action,
          message: message
        })
      };
      this.socket.send(JSON.stringify(performMessage));
    } else {
      console.error('WebSocket is not open. Cannot call channel method.');
    }
  }
}

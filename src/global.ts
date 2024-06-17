export type ConnectionStatus = "ACTIVE" | "INACTIVE" | "CONNECTING";
export type ChannelName = "BookingChannel" | "SubscriberCountChannel"
export var wsUrl = 'ws://kalkiapi.chandu.lol/cable';


export interface Theatre {
  type: string
  name: string;
  link: string;
  shows: string[];
}

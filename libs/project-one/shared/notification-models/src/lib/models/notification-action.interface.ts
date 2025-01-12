export interface NotificationActionInterface {
  key: string;
  // The way push notifications work is that the key value pairs must be strings
  // So we force that this way
  [key: string]: string;
}

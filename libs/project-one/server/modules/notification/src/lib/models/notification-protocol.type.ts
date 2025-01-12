export type NotificationProtocolType =
  // Send to the first available, ordered via below (Ex: Try websocket first, if not sent then try push, etc.)
  'any' |
  // Only send through web socket
  'socket' |
  // Only send via push notification
  'push' |
  // Only send via email
  'email'
  ;

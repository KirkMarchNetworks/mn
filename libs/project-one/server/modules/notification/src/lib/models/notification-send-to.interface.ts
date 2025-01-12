import { NotificationProtocolType } from "./notification-protocol.type";

export interface NotificationSendToInterface {
  userId: string;
  protocols: NotificationProtocolType[];
}

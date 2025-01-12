import { NotificationActionType } from "./notification-action.type";

export interface NotificationRequestInterface {
  title: string;
  body: string;
  action?: NotificationActionType;
}

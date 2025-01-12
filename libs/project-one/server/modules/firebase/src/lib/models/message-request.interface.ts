import { NotificationRequestInterface } from "@mn/project-one/shared/notification-models";

export interface MessageRequestInterface extends NotificationRequestInterface {
  userId: string;
}

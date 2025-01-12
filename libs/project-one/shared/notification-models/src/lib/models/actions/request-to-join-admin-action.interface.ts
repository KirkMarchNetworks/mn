import { NotificationActionInterface } from '../notification-action.interface';

export interface RequestToJoinAdminActionInterface extends NotificationActionInterface {
  key: 'request-to-join-admin';
  requestToJoinId: string;
}

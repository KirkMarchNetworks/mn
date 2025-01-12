import { NotificationActionInterface } from '../notification-action.interface';

export interface ContactActionInterface extends NotificationActionInterface {
  key: 'contact';
  contactId: string;
}

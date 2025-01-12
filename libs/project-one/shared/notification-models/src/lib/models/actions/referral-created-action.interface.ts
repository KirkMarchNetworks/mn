import { NotificationActionInterface } from '../notification-action.interface';

export interface ReferralCreatedActionInterface extends NotificationActionInterface {
  key: 'referral-created';
  referralId: string;
}

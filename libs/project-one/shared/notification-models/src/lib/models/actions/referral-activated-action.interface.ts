import { NotificationActionInterface } from '../notification-action.interface';

export interface ReferralActivatedActionInterface extends NotificationActionInterface {
  key: 'referral-activated';
  referralId: string;
}

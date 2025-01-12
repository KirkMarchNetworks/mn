import { ReferralCreatedActionInterface } from './actions/referral-created-action.interface';
import { ReferralActivatedActionInterface } from './actions/referral-activated-action.interface';
import {
  RequestToJoinAdminActionInterface
} from './actions/request-to-join-admin-action.interface';
import { ContactActionInterface } from './actions/contact-action.interface';

export type NotificationActionType =
  ReferralCreatedActionInterface |
  ReferralActivatedActionInterface |
  RequestToJoinAdminActionInterface |
  ContactActionInterface
  ;

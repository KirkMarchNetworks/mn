import { EvLicenseMetadataInterface } from './ev-license-metadata.interface';
import { CreateLicenseType } from '../../types/create-license.type';

export interface EvLicenseInterface extends Omit<CreateLicenseType, 'name'> {
  metadata?: EvLicenseMetadataInterface;
}

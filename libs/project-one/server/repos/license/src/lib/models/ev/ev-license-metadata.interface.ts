import { JsonObjectType } from '@mn/project-one/server/repos/repo-one';

export interface EvLicenseMetadataInterface extends JsonObjectType {
  downloadLimitGB: number;
  storageLimitGB: number;
}

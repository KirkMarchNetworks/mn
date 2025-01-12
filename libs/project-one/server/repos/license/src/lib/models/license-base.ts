import { JsonObjectType } from '@mn/project-one/server/repos/repo-one';
import { CreateLicenseType } from '../types/create-license.type';

export class LicenseBase implements CreateLicenseType {
  tenantId!: string;
  name!: string;
  issuedAt?: Date;
  expiresAt?: Date;
  metadata?: JsonObjectType;

  constructor(
    {
      tenantId,
      licenseName,
      expiresAt,
      issuedAt,
      metadata,
    }: {
      tenantId: string,
      licenseName: string,
      expiresAt?: Date,
      issuedAt?: Date,
      metadata?: JsonObjectType,
    }) {

    this.tenantId = tenantId;
    this.name = licenseName;
    this.expiresAt = expiresAt;
    this.issuedAt = issuedAt;
    this.metadata = metadata;
  }
}

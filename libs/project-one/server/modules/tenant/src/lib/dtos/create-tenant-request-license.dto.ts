import { OmitType } from '@nestjs/swagger';
import { CreateEvLicenseRequestDto } from '@mn/project-one/server/modules/license';

export class CreateTenantRequestLicenseDto extends OmitType(CreateEvLicenseRequestDto, ['tenantId'] as const) {}

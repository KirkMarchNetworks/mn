import { CreateTenantRequestLicenseDto } from './create-tenant-request-license.dto';
import { CreateTenantRequestDto } from './create-tenant-request.dto';

export class CreateTenantWithDefaultsRequestDto extends CreateTenantRequestDto {
  /**
   * The EV license params.
   */
  license?: CreateTenantRequestLicenseDto;
}

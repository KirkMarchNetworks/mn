import { CreateTenantResponseDto } from './create-tenant-response.dto';
import { DefaultRolesResponseDto } from '@mn/project-one/server/modules/role';
import { LicenseEntity } from '@mn/project-one/server/entities';

export class CreateTenantWithDefaultsResponseDto extends CreateTenantResponseDto {
  /**
   * The default role I.Ds for the newly created tenant
   */
  roles!: DefaultRolesResponseDto;
  /**
   * The list of licenses for the newly created tenant
   */
  licenses!: LicenseEntity[];
}

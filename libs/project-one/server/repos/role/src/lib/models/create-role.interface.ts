export interface CreateRoleInterface {
  tenantId: string;
  name: string;
  description?: string;
  permissionNames?: string[]
}

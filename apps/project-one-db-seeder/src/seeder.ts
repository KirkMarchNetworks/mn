import { INestApplication } from '@nestjs/common';
import { TenantService } from '@mn/project-one/server/modules/tenant';
import { UserService } from '@mn/project-one/server/modules/user';
import { RoleService } from '@mn/project-one/server/modules/role';
import { PermissionService } from '@mn/project-one/server/modules/permission';
import { AuthService } from '@mn/project-one/server/modules/auth';
import { LicenseService } from '@mn/project-one/server/modules/license';
import { LicensedProductService } from '@mn/project-one/server/modules/licensed-product';
import { DeviceAndChannelService } from '@mn/project-one/server/modules/device-and-channel';
import { IntelligentRetrievalService } from '@mn/project-one/server/modules/intelligent-retrieval';
import { GenerativeModelEnum } from '@prisma/project-one/one';

export const seeder = async (app: INestApplication) => {
  const tenantService = app.get(TenantService);
  const authService = app.get(AuthService);
  const licenseService = app.get(LicenseService);
  const licensedProductService = app.get(LicensedProductService);
  const userService = app.get(UserService);
  const roleService = app.get(RoleService);
  const permissionService = app.get(PermissionService);
  const deviceAndChannelService = app.get(DeviceAndChannelService);
  const intelligentRetrievalService = app.get(IntelligentRetrievalService);

  console.log('seeding');

  try {
    // Add all the licenses
    await licensedProductService.createDefaultLicensedProducts();

    // Create all the permissions
    await permissionService.createDefaultPermissions();

    const adminTenant = await tenantService.createTenant({
      name: 'admin',
      email: 'admin@admin.com',
    });

    // Create the super admin role for the admin tenant
    const superAdminRole = await roleService.createSuperAdminRole(
      adminTenant.id
    );

    // Default password.  TODO: Grab from .env
    const password = '1';

    // Create a verified super admin user for the admin tenant with the super admin role
    const adminUser = await authService.createVerifiedUser(adminTenant.id, {
      email: 'admin@admin.com',
      username: 'admin',
      password,
      roleId: superAdminRole.id,
    });

    // Create tenant1
    const tenant1 = await tenantService.createTenantWithDefaults({
      name: 'tenant1',
      email: 'admin@tenant1.com',
    });

    // Create verified user1 for tenant1 with adminRole
    await authService.createVerifiedUser(tenant1.id, {
      username: 'user1',
      email: 'user1@tenant1.com',
      password,
      roleId: tenant1.roles.adminRoleId,
    });

    // Create verified user2 for tenant1 with someRole
    await authService.createVerifiedUser(tenant1.id, {
      username: 'user2',
      email: 'user2@tenant1.com',
      password,
      roleId: tenant1.roles.someRoleId,
    });

    // Create an unverified user3 for tenant1 with limitedRole
    await authService.createUser(tenant1.id, {
      username: 'user3',
      email: 'user3@tenant1.com',
      roleId: tenant1.roles.limitedRoleId,
    });

    // Create 96 more users for testing
    for (let i = 4; i < 100; i++) {
      await authService.createVerifiedUser(tenant1.id, {
        username: `user${i}`,
        email: `user${i}@tenant1.com`,
        password,
        roleId: tenant1.roles.someRoleId,
      });
    }

    await intelligentRetrievalService.updateSettings(
      tenant1.id,
      { generativeModel: GenerativeModelEnum.AmazonTitanEmbedImageV1 }
    );
    const tenant1Device1 = await deviceAndChannelService.createDevice(
      tenant1.id,
      { name: 'Device 1' }
    );
    await deviceAndChannelService.createChannel(tenant1.id, {
      deviceId: tenant1Device1.id,
      name: 'Channel 1',
    });
    await deviceAndChannelService.createChannel(tenant1.id, {
      deviceId: tenant1Device1.id,
      name: 'Channel 2',
    });

    const tenant1Device2 = await deviceAndChannelService.createDevice(
      tenant1.id,
      { name: 'Device 2' }
    );
    await deviceAndChannelService.createChannel(tenant1.id, {
      deviceId: tenant1Device2.id,
      name: 'Channel 1',
    });
    await deviceAndChannelService.createChannel(tenant1.id, {
      deviceId: tenant1Device2.id,
      name: 'Channel 2',
    });

    // Create tenant2
    const tenant2 = await tenantService.createTenantWithDefaults({
      name: 'tenant2',
      email: 'admin@tenant2.com',
    });

    // Create verified user1 for tenant2 with adminRole
    await authService.createVerifiedUser(tenant2.id, {
      username: 'user1',
      email: 'user1@tenant2.com',
      password,
      roleId: tenant2.roles.adminRoleId,
    });

    // Create verified user2 for tenant2 with someRole
    await authService.createVerifiedUser(tenant2.id, {
      username: 'user2',
      email: 'user2@tenant2.com',
      password,
      roleId: tenant2.roles.someRoleId,
    });
  } catch (e) {
    console.error(e);
  }

  setTimeout(() => {
    process.exit(0);
  }, 9000);

  // await repoOneService.role.create({
  //   data: {
  //     name: 'Admin',
  //     description: 'Manage all files and all users',
  //     tenantId: tenant1.id,
  //     permissions: {
  //       connect: [
  //         {
  //
  //         }
  //       ]
  //     }
  //   }
  // })
  // await repoOneService.role.createMany({
  //   data: [
  //     {
  //       name: 'Admin',
  //       description: 'Manage all files and all users',
  //       tenantId: tenant1.id,
  //     }
  //   ]
  // })
  //
  // console.log(allPermissions);
};

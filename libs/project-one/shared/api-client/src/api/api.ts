export * from './authApi.service';
import { AuthApiService } from './authApi.service';
export * from './deviceAndChannelApi.service';
import { DeviceAndChannelApiService } from './deviceAndChannelApi.service';
export * from './fileApi.service';
import { FileApiService } from './fileApi.service';
export * from './healthApi.service';
import { HealthApiService } from './healthApi.service';
export * from './intelligentRetrievalApi.service';
import { IntelligentRetrievalApiService } from './intelligentRetrievalApi.service';
export * from './licenseApi.service';
import { LicenseApiService } from './licenseApi.service';
export * from './licensedProductApi.service';
import { LicensedProductApiService } from './licensedProductApi.service';
export * from './roleApi.service';
import { RoleApiService } from './roleApi.service';
export * from './tenantApi.service';
import { TenantApiService } from './tenantApi.service';
export * from './userApi.service';
import { UserApiService } from './userApi.service';
export const APIS = [AuthApiService, DeviceAndChannelApiService, FileApiService, HealthApiService, IntelligentRetrievalApiService, LicenseApiService, LicensedProductApiService, RoleApiService, TenantApiService, UserApiService];

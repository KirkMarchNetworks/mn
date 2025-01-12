/**
 * March Networks
 * Project One API description
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { LicenseEntity } from './licenseEntity';


export interface TenantEntity { 
    /**
     * The I.D of the tenant
     */
    id: string;
    /**
     * The name of the tenant
     */
    name: string;
    /**
     * The admin email of the tenant
     */
    email: string;
    /**
     * The permissions associated to the role
     */
    licenses: Array<LicenseEntity>;
}


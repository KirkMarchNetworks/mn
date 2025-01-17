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
import { EvLicensedProductMetadataDto } from './evLicensedProductMetadataDto';


export interface CreateEvLicensedProductRequestDto { 
    /**
     * The I.D of the tenant.
     */
    tenantId: string;
    /**
     * The date at which the license expires
     */
    expiresAt?: string;
    /**
     * The date at which the license was issued at
     */
    issuedAt?: string;
    /**
     * The required metadata for the license
     */
    metadata?: EvLicensedProductMetadataDto;
}


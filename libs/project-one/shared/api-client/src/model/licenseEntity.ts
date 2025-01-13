/**
 * March Networks
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface LicenseEntity { 
    /**
     * The I.D of licensed product.
     */
    id: string;
    /**
     * The I.D of the tenant.
     */
    tenantId: string;
    /**
     * The name of the license
     */
    name: string;
    /**
     * The date the license was issued
     */
    issuedAt: string;
    /**
     * The date the license expires
     */
    expiresAt: string | null;
    /**
     * The metadata associated to the license
     */
    metadata: object | null;
}


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


export interface CreateRoleRequestDto { 
    /**
     * The name to use for the role.
     */
    name: string;
    /**
     * A brief description of the role.
     */
    description: string;
    /**
     * All the permission names to associate with the role.
     */
    permissionNames?: Array<string>;
}

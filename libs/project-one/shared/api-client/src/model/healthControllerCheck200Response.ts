/**
 * March Networks
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { HealthControllerCheck200ResponseInfoValue } from './healthControllerCheck200ResponseInfoValue';


export interface HealthControllerCheck200Response { 
    status?: string;
    info?: { [key: string]: HealthControllerCheck200ResponseInfoValue; } | null;
    error?: { [key: string]: HealthControllerCheck200ResponseInfoValue; } | null;
    details?: { [key: string]: HealthControllerCheck200ResponseInfoValue; };
}


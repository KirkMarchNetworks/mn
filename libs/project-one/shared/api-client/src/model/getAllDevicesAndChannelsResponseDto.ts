/**
 * March Networks
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Channel2Entity } from './channel2Entity';
import { Device2Entity } from './device2Entity';


export interface GetAllDevicesAndChannelsResponseDto { 
    /**
     * All the devices.
     */
    devices: Array<Device2Entity>;
    /**
     * All the channels.
     */
    channels: Array<Channel2Entity>;
}


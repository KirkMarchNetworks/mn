/**
 * March Networks
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ChannelEntity } from './channelEntity';


export interface ChannelImageWithDistanceEntity { 
    /**
     * The vector distance from the search criteria. The closer the value is to 0, the closer it is to the search criteria.
     */
    distance: number | null;
    /**
     * The I.D of the role.
     */
    id: string;
    /**
     * The associated channel.
     */
    channel: ChannelEntity;
    /**
     * The name of the file.
     */
    fileName: string;
    /**
     * The name of the file.
     */
    originalName: string;
    /**
     * The timestamp of the image.
     */
    timestamp: string;
}


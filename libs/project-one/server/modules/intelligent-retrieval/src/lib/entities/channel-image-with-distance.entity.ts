import { ChannelImageWithDistanceType } from '@mn/project-one/server/repos/intelligent-retrieval';
import { ChannelImageEntity } from './channel-image.entity';

export class ChannelImageWithDistanceEntity extends ChannelImageEntity implements ChannelImageWithDistanceType {
  /**
   * The vector distance from the search criteria.
   * The closer the value is to 0, the closer it is to the search criteria.
   * @example '0.56789'
   */
  distance!: number|null;
}

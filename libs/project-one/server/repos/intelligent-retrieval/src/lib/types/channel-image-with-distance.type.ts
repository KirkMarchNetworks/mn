import { ChannelImageType } from './channel-image.type';

export type ChannelImageWithDistanceType = ChannelImageType & {
  distance: number|null;
}

import { ChannelImageWithDistanceEntity } from '@mn/project-one/shared/api-client';
import { SortSearchInterface } from '../models/sort-search.interface';

export const ChannelImageWithDistanceEntitySearchable: SortSearchInterface<ChannelImageWithDistanceEntity> = {
  sort: {
    distance: {
      displayName: 'distance'
    },
    'channel.id': {
      displayName: 'channelId'
    },
    'channel.device.id': {
      displayName: 'deviceId'
    },
  },
  search: {
    'channel.id': {
      displayName: 'channelId',
      dbType: 'string'
    },
    'channel.name': {
      displayName: 'channelName',
      dbType: 'string'
    },
    'channel.device.id': {
      displayName: 'deviceId',
      dbType: 'string'
    },
    'channel.device.name': {
      displayName: 'deviceName',
      dbType: 'string'
    },
    'timestamp': {
      displayName: 'timestamp',
      dbType: 'date'
    }
  }
}

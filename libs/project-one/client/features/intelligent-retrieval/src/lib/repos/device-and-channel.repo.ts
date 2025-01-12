import { Channel2Entity, Device2Entity, GetAllDevicesAndChannelsResponseDto } from '@mn/project-one/shared/api-client';
import { createStore, select, withProps } from '@ngneat/elf';
import { Injectable } from '@angular/core';
import { entitiesPropsFactory, selectAllEntities, setEntities, withEntities } from '@ngneat/elf-entities';
import { combineLatest, map } from 'rxjs';

const { channelEntitiesRef, withChannelEntities } = entitiesPropsFactory('channel');

export const store = createStore(
  { name: 'deviceAndChannel' },
  withEntities<Device2Entity>(),
  withChannelEntities<Channel2Entity>(),
  withProps<{ fetched: boolean }>({
    fetched: false
  })
);

@Injectable({ providedIn: 'root' })
export class DeviceAndChannelRepo {
  fetched$ = store.pipe(select(state => state.fetched));
  devices$ = store.pipe(selectAllEntities());
  channels$ = store.pipe(selectAllEntities({ ref: channelEntitiesRef }));

  devicesAndChannels$ = combineLatest([
    this.devices$,
    this.channels$
  ]).pipe(
    map(([ devices, channels ]) => ({
      devices,
      channels
    }))
  );

  update(dto: GetAllDevicesAndChannelsResponseDto) {
    store.update(
      setEntities(dto.devices),
      setEntities(dto.channels, { ref: channelEntitiesRef })
    )
  }
}

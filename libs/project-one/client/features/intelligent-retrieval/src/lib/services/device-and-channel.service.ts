import { inject, Injectable } from '@angular/core';
import { DeviceAndChannelApiService } from '@mn/project-one/shared/api-client';
import { DeviceAndChannelRepo } from '../repos/device-and-channel.repo';
import { mergeMap, switchMap, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceAndChannelService {
  private _apiService = inject(DeviceAndChannelApiService);
  private _repo = inject(DeviceAndChannelRepo);

  getAllDevicesAndChannels() {
    return this._repo.fetched$.pipe(
      take(1),
      mergeMap(fetched => {
        const devicesAndChannels$ = this._repo.devicesAndChannels$;

        if (! fetched) {
          return this._apiService.deviceAndChannelControllerGetAllDevicesAndChannels().pipe(
            tap(res => {
              this._repo.update(res);
            }),
            switchMap(() => devicesAndChannels$)
          );
        }

        return devicesAndChannels$;
      })
    );
  }
}

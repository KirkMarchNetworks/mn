import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatFormField,
  MatHint,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ControlsOfType } from '@mn/project-one/client/models';
import {
  Channel2Entity,
  Device2Entity,
} from '@mn/project-one/shared/api-client';
import { Subscription } from 'rxjs';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { DeviceAndChannelService } from '../../../../services/device-and-channel.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { provideMomentDatetimeAdapter } from '@ng-matero/extensions-moment-adapter';
import {
  MtxCalendarView,
  MtxDatetimepickerMode,
  MtxDatetimepickerModule,
  MtxDatetimepickerType,
} from '@ng-matero/extensions/datetimepicker';
import { UploadFormInterface } from './models/upload-form.interface';

@Component({
  selector: 'lib-intelligent-retrieval-upload-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    MatHint,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatSuffix,
    MatOption,
    MatSelect,
    MatExpansionModule,
    MtxDatetimepickerModule,
  ],
  providers: [
    provideMomentDatetimeAdapter({
      parse: {
        dateInput: 'YYYY-MM-DD',
        monthInput: 'MMMM',
        yearInput: 'YYYY',
        timeInput: 'HH:mm',
        datetimeInput: 'YYYY-MM-DD HH:mm',
      },
      display: {
        dateInput: 'YYYY-MM-DD',
        monthInput: 'MMMM',
        yearInput: 'YYYY',
        timeInput: 'HH:mm',
        datetimeInput: 'YYYY-MM-DD HH:mm',
        monthYearLabel: 'YYYY MMMM',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
        popupHeaderDateLabel: 'MMM DD, ddd',
      },
    }),
  ],
  templateUrl: './upload-form.component.html',
  styleUrl: './upload-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFormComponent implements OnInit, OnDestroy {
  @Output() formUpdated = new EventEmitter<UploadFormInterface>();
  readonly panelOpenState = signal(true);
  devices = signal<Device2Entity[]>([]);
  private _channels: Channel2Entity[] = [];
  channels = signal<Channel2Entity[]>([]);

  formGroup = inject(NonNullableFormBuilder).group<
    ControlsOfType<{ deviceId: string; channelId: string; timestamp: string }>
  >({
    deviceId: new FormControl('', {
      nonNullable: true,
    }),
    channelId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    timestamp: new FormControl('', {
      nonNullable: true,
    }),
  });

  private _deviceAndChannelService = inject(DeviceAndChannelService);

  private _subscriptions = new Subscription();

  type: MtxDatetimepickerType = 'datetime';
  mode: MtxDatetimepickerMode = 'auto';
  startView: MtxCalendarView = 'month';
  multiYearSelector = false;
  touchUi = false;
  twentyFourHour = false;
  timeInterval = 1;
  timeInput = true;

  datetime = '';

  ngOnInit() {
    this._subscriptions.add(
      this._deviceAndChannelService
        .getAllDevicesAndChannels()
        .subscribe((res) => {
          this.devices.set(res.devices);
          this._channels = res.channels;

          if (res.devices.length) {
            const deviceId = res.devices[0].id;
            const channel = res.channels.find((x) => x.deviceId === deviceId);
            if (deviceId && channel) {
              this.formGroup.controls.deviceId.setValue(deviceId);
              this.formGroup.controls.channelId.setValue(channel.id);
              this._applyUpdate();
            }
          }
        })
    );

    this.formGroup.controls.deviceId.valueChanges.subscribe((deviceId) => {
      this.channels.set(this._channels.filter((x) => x.deviceId === deviceId));
      this.formGroup.controls.channelId.reset();
    });
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    }

    this._applyUpdate();
    this.panelOpenState.set(false);
  }

  _applyUpdate() {
    const { deviceId, channelId, timestamp } = this.formGroup.getRawValue();
    const device = this.devices().find((x) => x.id === deviceId);
    const channel = this.channels().find((x) => x.id === channelId);

    if (device && channel) {
      let timestampString: string | undefined;

      if (timestamp) {
        timestampString = (timestamp as unknown as Date).toISOString();
      }
      this.formUpdated.emit({
        channel: {
          id: channel.id,
          name: channel.name,
        },
        device: {
          id: device.id,
          name: device.name,
        },
        timestamp: timestampString,
      });
    }
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Signal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TusUploaderComponent } from '@mn/project-one/client/components/tus-uploader';
import {
  MultiUploadRequestInterface,
  ServerRouting,
} from '@mn/project-one/shared/models';
import { UploadFormComponent } from './components/upload-form/upload-form.component';
import { UploadFormInterface } from './components/upload-form/models/upload-form.interface';

@Component({
  selector: 'lib-account',
  standalone: true,
  imports: [CommonModule, TusUploaderComponent, UploadFormComponent],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadComponent {
  tusEndpoint =
    ServerRouting.intelligentRetrieval.children.multiUpload.absolutePath();
  private _formData = signal<UploadFormInterface | null>(null);
  formData = this._formData.asReadonly();
  tusHeaderMetadata: Signal<MultiUploadRequestInterface | null> = computed(
    () => {
      const data = this.formData();
      if (data) {
        return {
          channelId: data.channel.id,
          timestamp: data.timestamp,
        };
      }
      return null;
    }
  );

  onFormUpdated(value: UploadFormInterface) {
    this._formData.set(value);
  }
}

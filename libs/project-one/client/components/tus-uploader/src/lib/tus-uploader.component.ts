import { AfterViewInit, Component, ViewChild, ElementRef, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import Dashboard from '@uppy/dashboard';
import Tus from '@uppy/tus';
import { TusUploaderService } from './services/tus-uploader.service';
import { ServerRouting, TusMetadataHeaderName } from '@mn/project-one/shared/models';
import { CoreRepo } from '@mn/project-one/client/repos/core';
import { firstValueFrom, lastValueFrom } from 'rxjs';

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@Component({
  selector: 'lib-tus-uploader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tus-uploader.component.html',
  styleUrl: './tus-uploader.component.scss',
})
export class TusUploaderComponent implements AfterViewInit {
  @Input({ required: true}) tusEndpoint!: string;
  @Input() tusHeaderMetadata: Record<string, string | null> | null = null;

  @ViewChild('uppyContainer') uppyContainer: ElementRef<HTMLDivElement>|undefined;

  tusUploaderService = inject(TusUploaderService);

  private _token$ = inject(CoreRepo).token$;

  private async _getAuthToken() {
    return await firstValueFrom(this._token$);
  }

  ngAfterViewInit() {
    this.tusUploaderService.loadUppy(uppy => {
      new uppy()
        .use(Dashboard, {
          inline: true,
          target: this.uppyContainer?.nativeElement,

        })
        .use(Tus, {
          endpoint: this.tusEndpoint,
          onBeforeRequest: async (req) => {
            const token = await this._getAuthToken();
            req.setHeader('Authorization', `Bearer ${token}`);

            if (req.getMethod().toLowerCase() === 'post') {
              req.setHeader(TusMetadataHeaderName, JSON.stringify(this.tusHeaderMetadata));
            }
          },
          onAfterResponse: async (req, res) => {
            if (res.getStatus() === 401) {
              await timeout(1000);
            }
          },
        });
    });
  }
}

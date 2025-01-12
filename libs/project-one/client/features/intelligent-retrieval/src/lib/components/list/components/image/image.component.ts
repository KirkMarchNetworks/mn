import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataComponentInterface } from '@mn/project-one/client/components/tableau';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { IntelligentRetrievalService } from '../../../../services/intelligent-retrieval.service';

@Component({
  selector: 'lib-intelligent-retrieval-search-image',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent
  implements DataComponentInterface<string>, OnInit, OnDestroy
{
  @Input({ required: true }) data!: string;
  dataUrl = signal('');

  private _service = inject(IntelligentRetrievalService);
  private _subscription = new Subscription();

  ngOnInit() {
    this._subscription.add(
      this._service
        .getImageDataUrl(this.data)
        .subscribe((dataUrl) => this.dataUrl.set(dataUrl))
    );
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}

import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IntelligentRetrievalService } from './services/intelligent-retrieval.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-intelligent-retrieval',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  templateUrl: './intelligent-retrieval.component.html',
  styleUrl: './intelligent-retrieval.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntelligentRetrievalComponent implements OnInit, OnDestroy {

  private _subscriptions = new Subscription();
  private _service = inject(IntelligentRetrievalService);

  ngOnInit() {
    console.log('IntelligentRetrievalComponent ngOnInit');
    this._subscriptions.add(
      this._service.getSettings().subscribe()
    );
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }
}

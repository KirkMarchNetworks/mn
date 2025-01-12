import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@mn/project-one/client/services/auth';
import { auditTime, interval, mergeMap, Subject, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProgressSpinnerComponent } from '@mn/project-one/client/components/progress-spinner';

@Component({
  selector: 'lib-project-one-client-features-logout',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerComponent],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent {
  loadingMessage = signal('Initializing a secure logout...')
  loadingProgress = signal(5);

  private _authService = inject(AuthService);

  private _startIntervalSubject = new Subject<null>();

  constructor() {
    // This observable is just an example and should be removed.
    this._startIntervalSubject.pipe(
      take(1),
      // Since we aren't making a real service logout call, and we know that we've created
      // a delay of exactly 2 seconds to simulate an actual request being made, we can
      // Create an interval every 100 milliseconds
      mergeMap(() => interval(100)),
      // Take only 20 of them (2 seconds worth)
      take(20),
      takeUntilDestroyed(),
    ).subscribe(() => {
      // Update the loading progress
      this._updateLoadingProgress();
    });

    this._authService.isLoggedOut$.pipe(
      take(1),
      takeUntilDestroyed()
    ).subscribe(isLoggedOut => {
      // Update the loading message
      this.loadingMessage.set('Logging out securely...');

      this._startIntervalSubject.next(null);
      // If already logged out
      this._authService.finishLogout(isLoggedOut);
    });

  }

  // Update the loading progress by increments of 5
  private _updateLoadingProgress() {
    this.loadingProgress.update(value => {
      return value + 5
    });
  }
}


import { inject, Injectable } from '@angular/core';
import { DefaultTitleStrategy, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { CoreUiRepo } from '@mn/project-one/client/repos/core-ui';

@Injectable({
  providedIn: 'root'
})
export class TitleService extends TitleStrategy {
  private _defaultStrategy = inject(DefaultTitleStrategy);
  private _coreUiRepo = inject(CoreUiRepo);

  updateTitle(snapshot: RouterStateSnapshot): void {
    this._defaultStrategy.updateTitle(snapshot);

    const titleName = this.buildTitle(snapshot) ?? '';

    this._coreUiRepo.updateTitle(titleName);
  }
}

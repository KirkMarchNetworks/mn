import { Injectable } from '@angular/core';
import { createStore, emitOnce, filterNil, select, withProps } from '@ngneat/elf';
import { excludeKeys, persistState } from '@ngneat/elf-persist-state';
import { PreferencesLocalStorageWrapper } from '@mn/project-one/client/models';
import { map } from 'rxjs/operators';
import { AuthResponseDto, UserEntity } from '@mn/project-one/shared/api-client';

export interface CoreProps {
  tokenRefreshing: boolean;
  token: string;
  user: UserEntity|null;
}

export const store = createStore(
  { name: 'core' },
  withProps<CoreProps>({
    tokenRefreshing: false,
    token: '',
    user: null,
  }),
);

const instance = persistState(store, {
  storage: PreferencesLocalStorageWrapper,
  source: () => store.pipe(excludeKeys([ 'tokenRefreshing' ])),
})

@Injectable({ providedIn: 'root' })
export class CoreRepo {

  initialized$ = instance.initialized$;

  user$ = store.pipe(select(state => state.user));

  userWhenSet$ = this.user$.pipe(
    filterNil()
  );

  getUsername = () => store.getValue().user?.username ?? '';

  getUserPublicId = () => store.getValue().user?.publicId ?? '';

  userPublicId$ = this.userWhenSet$.pipe(
    map(x => x.publicId)
  );

  userEmail$ = this.userWhenSet$.pipe(
    map(x => x.email)
  );

  token$ = store.pipe(select(state => state.token));
  tokenRefreshing$ = store.pipe(select(state => state.tokenRefreshing));

  reset() {
    store.reset();
  }

  updateAuth(data: AuthResponseDto) {
    emitOnce(() => {
      this.updateToken(data.token);
      this.updateUser(data.user);
    });
  }

  updateToken(token: CoreProps['token']) {
    store.update((state) => ({
      ...state,
      token
    }));
  }

  updateUser(user: CoreProps['user']) {
    store.update((state) => ({
      ...state,
      user
    }));
  }

  updateTokenRefreshing(tokenRefreshing: CoreProps['tokenRefreshing']) {
    store.update((state) => ({
      ...state,
      tokenRefreshing
    }));
  }
}

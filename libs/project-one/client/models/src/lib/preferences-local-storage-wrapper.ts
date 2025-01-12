import { Preferences } from '@capacitor/preferences';
import { Async, StateStorage } from '@ngneat/elf-persist-state';

export const PreferencesLocalStorageWrapper: StateStorage = {
  getItem<T extends Record<string, any>>(key: string): Async<T | null | undefined> {
    return new Promise(async resolve => {
      const result = await Preferences.get({ key });
      if (result.value) {
        resolve(JSON.parse(result.value))
      }
      resolve(null);
    })
  },

  removeItem(key: string): Async<boolean | void> {
    return new Promise(async resolve => {
      const result = await Preferences.remove({ key });
      resolve(result);
    })
  },

  setItem(key: string, value: Record<string, any>): Async<any> {
    return new Promise(async resolve => {
      const valueToJSON = JSON.stringify(value);
      const result = await Preferences.set({ key, value: valueToJSON });
      resolve(result as any);
    })
  }
}

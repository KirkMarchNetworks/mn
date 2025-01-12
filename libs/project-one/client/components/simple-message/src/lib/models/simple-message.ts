import { signal } from '@angular/core';

export class SimpleMessage {
  private _message = signal('');
  message = this._message.asReadonly();

  setMessage(message: string) {
    this._message.set(message);
  }

  clear() {
    this._message.set('');
  }
}

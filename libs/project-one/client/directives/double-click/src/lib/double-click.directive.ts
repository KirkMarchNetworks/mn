import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[libDoubleClick]',
  standalone: true,
})
export class DoubleClickDirective {
  @Output() singleClick = new EventEmitter<MouseEvent>();
  @Output() doubleClick = new EventEmitter<MouseEvent>();
  private timer = 0;
  private stopClick = false;

  @HostListener('click', ['$event']) onClick(e: MouseEvent) {
    this.timer = 0;
    this.stopClick = false;

    this.timer = setTimeout(() => {
      if (!this.stopClick) {
        this.singleClick.emit(e);
      }
    }, 200) as unknown as number;
  }

  @HostListener('dblclick', ['$event']) onDblClick(e: MouseEvent) {
    this.stopClick = true;
    clearTimeout(this.timer);
    this.doubleClick.emit(e);
  }
}

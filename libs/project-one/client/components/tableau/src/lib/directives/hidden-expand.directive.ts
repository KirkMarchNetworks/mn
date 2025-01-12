import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[libHiddenExpandHost]',
  standalone: true,
})
export class HiddenExpandDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

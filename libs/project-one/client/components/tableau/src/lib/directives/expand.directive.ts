import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[libExpandHost]',
  standalone: true,
})
export class ExpandDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

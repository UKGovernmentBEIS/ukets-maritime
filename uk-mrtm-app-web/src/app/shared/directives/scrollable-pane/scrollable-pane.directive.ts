import { Directive, HostBinding, input } from '@angular/core';

@Directive({
  selector: '[mrtmScrollablePane]',
  standalone: true,
})
export class ScrollablePaneDirective {
  readonly ariaLabel = input.required<string>();

  @HostBinding('class.moj-scrollable-pane')
  readonly scrollableClass = true;

  @HostBinding('attr.role')
  readonly role = 'region';

  @HostBinding('tabindex')
  readonly tabindex = 0;

  @HostBinding('attr.aria-label')
  get label() {
    return this.ariaLabel();
  }
}

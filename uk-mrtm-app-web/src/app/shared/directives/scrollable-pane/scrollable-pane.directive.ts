import { Directive, input } from '@angular/core';

@Directive({
  selector: '[mrtmScrollablePane]',
  standalone: true,
  host: {
    '[class.moj-scrollable-pane]': 'scrollableClass',
    '[attr.role]': 'role',
    '[tabindex]': 'tabindex',
    '[attr.aria-label]': 'label',
  },
})
export class ScrollablePaneDirective {
  readonly ariaLabel = input.required<string>();

  readonly scrollableClass = true;

  readonly role = 'region';

  readonly tabindex = 0;

  get label() {
    return this.ariaLabel();
  }
}

import { Directive } from '@angular/core';

@Directive({
  selector: 'div[govukInsetText]',
  standalone: true,
  host: { '[class]': 'elementClass' },
})
export class InsetTextDirective {
  elementClass = 'govuk-inset-text';
}

import { Directive } from '@angular/core';

@Directive({
  selector: 'div[govukSummaryListRow]',
  standalone: true,
  host: { '[class]': 'className' },
})
export class SummaryListRowDirective {
  className = 'govuk-summary-list__row';
}

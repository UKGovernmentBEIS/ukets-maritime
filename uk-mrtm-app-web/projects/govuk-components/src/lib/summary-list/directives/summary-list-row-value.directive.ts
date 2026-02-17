import { Directive } from '@angular/core';

@Directive({
  selector: 'dd[govukSummaryListRowValue]',
  standalone: true,
  host: { '[class]': 'className' },
})
export class SummaryListRowValueDirective {
  className = 'govuk-summary-list__value';
}

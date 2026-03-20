import { Directive } from '@angular/core';

@Directive({
  selector: 'dt[govukSummaryListRowKey]',
  standalone: true,
  host: { '[class]': 'className' },
})
export class SummaryListRowKeyDirective {
  className = 'govuk-summary-list__key';
}

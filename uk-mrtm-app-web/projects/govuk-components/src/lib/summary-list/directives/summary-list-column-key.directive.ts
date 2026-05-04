import { Directive } from '@angular/core';

@Directive({
  selector: 'dt[govukSummaryListColumnKey]',
  standalone: true,
  host: { '[class]': 'className' },
})
export class SummaryListColumnKeyDirective {
  className = 'govuk-summary-list__key';
}

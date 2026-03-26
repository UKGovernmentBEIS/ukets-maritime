import { Directive } from '@angular/core';

@Directive({
  selector: 'dd[govukSummaryListRowActions]',
  standalone: true,
  host: { '[class]': 'className' },
})
export class SummaryListRowActionsDirective {
  className = 'govuk-summary-list__actions';
}

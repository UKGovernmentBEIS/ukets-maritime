import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { nonComplianceSubmittedQuery } from '@requests/timeline/non-compliance-submitted/+state';
import { NonComplianceDetailsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-non-compliance-submitted',
  standalone: true,
  imports: [NonComplianceDetailsSummaryTemplateComponent],
  template: `
    <mrtm-non-compliance-details-summary-template [data]="nonComplianceDetailsSummary()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly nonComplianceDetailsSummary = this.store.select(
    nonComplianceSubmittedQuery.selectNonComplianceDetailsSummary,
  );
}

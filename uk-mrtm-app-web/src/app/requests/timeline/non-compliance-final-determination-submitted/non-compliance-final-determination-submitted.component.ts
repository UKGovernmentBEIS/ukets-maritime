import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { nonComplianceFinalDeterminationSubmittedQuery } from '@requests/timeline/non-compliance-final-determination-submitted/+state';
import { NonComplianceFinalDeterminationDetailsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-non-compliance-final-determination-submitted',
  imports: [NonComplianceFinalDeterminationDetailsSummaryTemplateComponent],
  standalone: true,
  template: `
    <mrtm-non-compliance-final-determination-details-summary-template [data]="nonComplianceFinalDetermination()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceFinalDeterminationSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly nonComplianceFinalDetermination = this.store.select(
    nonComplianceFinalDeterminationSubmittedQuery.selectNonComplianceFinalDetermination,
  );
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AerSmf } from '@mrtm/api';

import { ReductionClaimDetailsSummaryTemplateComponent } from '@shared/components/summaries/reduction-claim-details-summary-template';
import { ReductionClaimSummaryTemplateComponent } from '@shared/components/summaries/reduction-claim-summary-template';
import { ReductionClaimDetailsListItemDto, SubTaskListMap, WithNeedsReview } from '@shared/types';

@Component({
  selector: 'mrtm-reduction-claim-submitted-summary-template',
  imports: [ReductionClaimSummaryTemplateComponent, ReductionClaimDetailsSummaryTemplateComponent],
  standalone: true,
  templateUrl: './reduction-claim-submitted-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReductionClaimSubmittedSummaryTemplateComponent {
  readonly data = input<AerSmf>();
  readonly wizardMap = input<SubTaskListMap<AerSmf>>();
  readonly fuelPurchases = input<Array<WithNeedsReview<ReductionClaimDetailsListItemDto>>>();
  readonly dataSupplierName = input<string>();
}

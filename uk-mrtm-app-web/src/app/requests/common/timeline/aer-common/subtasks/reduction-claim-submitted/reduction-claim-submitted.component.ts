import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { reductionClaimMap } from '@requests/common/aer/subtasks/reduction-claim';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  EmpReviewDecisionSummaryTemplateComponent,
  ReductionClaimDetailsSummaryTemplateComponent,
  ReductionClaimSummaryTemplateComponent,
} from '@shared/components';

@Component({
  selector: 'mrtm-reduction-claim-submitted',
  standalone: true,
  imports: [
    ReturnToTaskOrActionPageComponent,
    PageHeadingComponent,
    ReductionClaimSummaryTemplateComponent,
    ReductionClaimDetailsSummaryTemplateComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './reduction-claim-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReductionClaimSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  public readonly map = reductionClaimMap;
  public readonly data = this.store.select(aerTimelineCommonQuery.selectReductionClaim);
  public readonly fuelPurchases = this.store.select(aerTimelineCommonQuery.selectReductionClaimDetailsListItems);

  readonly withReviewDecision = this.store.select(aerTimelineCommonQuery.withReviewDetermination);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('EMISSIONS_REDUCTION_CLAIM'),
  );
}

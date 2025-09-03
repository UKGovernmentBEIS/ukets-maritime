import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { reductionClaimMap } from '@requests/common/aer/subtasks/reduction-claim';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  ReductionClaimDetailsSummaryTemplateComponent,
  ReductionClaimSummaryTemplateComponent,
  ReviewDecisionSummaryTemplateComponent,
} from '@shared/components';

@Component({
  selector: 'mrtm-reduction-claim-submitted',
  standalone: true,
  imports: [
    ReturnToTaskOrActionPageComponent,
    PageHeadingComponent,
    ReductionClaimSummaryTemplateComponent,
    ReductionClaimDetailsSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './reduction-claim-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReductionClaimSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  public readonly map = reductionClaimMap;
  public readonly data = this.store.select(aerTimelineCommonQuery.selectReductionClaim);
  public readonly fuelPurchases = this.store.select(aerTimelineCommonQuery.selectReductionClaimDetailsListItems);

  readonly isReviewCompletedActionType = this.store.select(aerTimelineCommonQuery.isReviewCompletedActionType);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('EMISSIONS_REDUCTION_CLAIM'),
  );
}

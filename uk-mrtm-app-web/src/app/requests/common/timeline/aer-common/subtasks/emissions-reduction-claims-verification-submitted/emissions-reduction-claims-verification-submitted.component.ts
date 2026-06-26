import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { emissionsReductionClaimVerificationSubtaskListMap } from '@requests/common/aer/subtasks/emissions-reduction-claim-verification';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  EmissionsReductionClaimsVerificationSummaryTemplateComponent,
  ReviewDecisionSummaryTemplateComponent,
} from '@shared/components';

@Component({
  selector: 'mrtm-emissions-reduction-claims-verification-submitted',
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    EmissionsReductionClaimsVerificationSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emissions-reduction-claims-verification-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionsReductionClaimsVerificationSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly map = emissionsReductionClaimVerificationSubtaskListMap;
  readonly emissionsReductionClaimVerification = this.store.select(
    aerTimelineCommonQuery.selectEmissionsReductionClaimVerification,
  );
  readonly isReviewCompletedActionType = this.store.select(aerTimelineCommonQuery.isReviewCompletedActionType);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('EMISSIONS_REDUCTION_CLAIM_VERIFICATION'),
  );
}

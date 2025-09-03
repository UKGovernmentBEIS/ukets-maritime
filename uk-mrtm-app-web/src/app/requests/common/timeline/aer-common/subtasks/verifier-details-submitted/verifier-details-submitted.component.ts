import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { verifierDetailsMap } from '@requests/common/aer';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  ReviewDecisionSummaryTemplateComponent,
  VerifierDetailsSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-verifier-details-submitted',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    VerifierDetailsSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './verifier-details-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifierDetailsSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly verifierDetails = this.store.select(aerTimelineCommonQuery.selectVerifierDetails);
  readonly map = verifierDetailsMap;

  readonly isReviewCompletedActionType = this.store.select(aerTimelineCommonQuery.isReviewCompletedActionType);
  readonly decision = this.store.select(aerTimelineCommonQuery.selectSummaryReviewGroupDecision('VERIFIER_DETAILS'));
}

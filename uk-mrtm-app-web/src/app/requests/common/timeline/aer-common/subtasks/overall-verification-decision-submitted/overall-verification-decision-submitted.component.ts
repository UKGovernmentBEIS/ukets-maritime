import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { overallVerificationDecisionMap } from '@requests/common/aer';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  AerOverallVerificationDecisionSummaryTemplateComponent,
  EmpReviewDecisionSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-overall-verification-decision-submitted',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    AerOverallVerificationDecisionSummaryTemplateComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './overall-verification-decision-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverallVerificationDecisionSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly overallVerificationDecision = this.store.select(aerTimelineCommonQuery.selectOverallVerificationDecision);
  readonly map = overallVerificationDecisionMap;

  readonly withReviewDecision = this.store.select(aerTimelineCommonQuery.withReviewDetermination);
  readonly decision = this.store.select(aerTimelineCommonQuery.selectSummaryReviewGroupDecision('OVERALL_DECISION'));
}

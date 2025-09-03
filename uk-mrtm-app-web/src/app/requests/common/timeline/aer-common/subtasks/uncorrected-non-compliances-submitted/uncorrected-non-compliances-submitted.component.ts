import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { uncorrectedNonCompliancesMap } from '@requests/common/aer';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  ReviewDecisionSummaryTemplateComponent,
  UncorrectedNonCompliancesSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-uncorrected-non-compliances-submitted',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    UncorrectedNonCompliancesSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './uncorrected-non-compliances-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UncorrectedNonCompliancesSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly uncorrectedNonCompliances = this.store.select(aerTimelineCommonQuery.selectUncorrectedNonCompliances);
  readonly map = uncorrectedNonCompliancesMap;

  readonly isReviewCompletedActionType = this.store.select(aerTimelineCommonQuery.isReviewCompletedActionType);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('UNCORRECTED_NON_COMPLIANCES'),
  );
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { uncorrectedNonConformitiesMap } from '@requests/common/aer';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  ReviewDecisionSummaryTemplateComponent,
  UncorrectedNonConformitiesSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-uncorrected-non-conformities-submitted',
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    UncorrectedNonConformitiesSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './uncorrected-non-conformities-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UncorrectedNonConformitiesSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly uncorrectedNonConformities = this.store.select(aerTimelineCommonQuery.selectUncorrectedNonConformities);
  readonly map = uncorrectedNonConformitiesMap;

  readonly isReviewCompletedActionType = this.store.select(aerTimelineCommonQuery.isReviewCompletedActionType);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('UNCORRECTED_NON_CONFORMITIES'),
  );
}

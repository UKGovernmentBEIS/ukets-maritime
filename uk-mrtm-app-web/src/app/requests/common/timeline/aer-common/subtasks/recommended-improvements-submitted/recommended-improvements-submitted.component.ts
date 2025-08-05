import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { recommendedImprovementsMap } from '@requests/common/aer';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  EmpReviewDecisionSummaryTemplateComponent,
  RecommendedImprovementsSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-recommended-improvements-submitted',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    RecommendedImprovementsSummaryTemplateComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './recommended-improvements-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendedImprovementsSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly recommendedImprovements = this.store.select(aerTimelineCommonQuery.selectRecommendedImprovements);
  readonly map = recommendedImprovementsMap;

  readonly withReviewDecision = this.store.select(aerTimelineCommonQuery.withReviewDetermination);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('RECOMMENDED_IMPROVEMENTS'),
  );
}

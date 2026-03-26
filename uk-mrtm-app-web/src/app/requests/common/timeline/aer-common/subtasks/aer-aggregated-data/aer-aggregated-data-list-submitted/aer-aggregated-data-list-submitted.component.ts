import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { aerAggregatedDataSubtasksListMap } from '@requests/common/aer/subtasks/aer-aggregated-data';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  AggregatedDataListSummaryTemplateComponent,
  ReviewDecisionSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-aer-aggregated-data-list-submitted',
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    AggregatedDataListSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './aer-aggregated-data-list-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataListSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly aggregatedData = this.store.select(aerTimelineCommonQuery.selectAggregatedDataList);
  readonly map = aerAggregatedDataSubtasksListMap;

  readonly isReviewCompletedActionType = this.store.select(aerTimelineCommonQuery.isReviewCompletedActionType);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('AGGREGATED_EMISSIONS_DATA'),
  );
}

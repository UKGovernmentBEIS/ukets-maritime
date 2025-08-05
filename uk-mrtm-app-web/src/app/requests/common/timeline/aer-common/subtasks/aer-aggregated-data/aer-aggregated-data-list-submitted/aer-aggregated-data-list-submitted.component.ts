import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { aerAggregatedDataSubtasksListMap } from '@requests/common/aer/subtasks/aer-aggregated-data';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  AggregatedDataListSummaryTemplateComponent,
  EmpReviewDecisionSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-aer-aggregated-data-list-submitted',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    AggregatedDataListSummaryTemplateComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './aer-aggregated-data-list-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataListSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly aggregatedData = this.store.select(aerTimelineCommonQuery.selectAggregatedDataList);
  readonly map = aerAggregatedDataSubtasksListMap;

  readonly withReviewDecision = this.store.select(aerTimelineCommonQuery.withReviewDetermination);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('AGGREGATED_EMISSIONS_DATA'),
  );
}

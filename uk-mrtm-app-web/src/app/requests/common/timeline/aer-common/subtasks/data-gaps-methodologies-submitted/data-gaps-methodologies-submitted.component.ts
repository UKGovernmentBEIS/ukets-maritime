import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { dataGapsMethodologiesMap } from '@requests/common/aer';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  DataGapsMethodologiesSummaryTemplateComponent,
  EmpReviewDecisionSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-data-gaps-methodologies-submitted',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    DataGapsMethodologiesSummaryTemplateComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './data-gaps-methodologies-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGapsMethodologiesSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly dataGapsMethodologies = this.store.select(aerTimelineCommonQuery.selectDataGapsMethodologies);
  readonly map = dataGapsMethodologiesMap;

  readonly withReviewDecision = this.store.select(aerTimelineCommonQuery.withReviewDetermination);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('CLOSE_DATA_GAPS_METHODOLOGIES'),
  );
}

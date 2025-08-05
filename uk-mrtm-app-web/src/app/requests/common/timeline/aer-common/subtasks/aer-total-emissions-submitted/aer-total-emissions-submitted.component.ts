import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  AerTotalEmissionsSummaryTemplateComponent,
  EmpReviewDecisionSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-aer-total-emissions-submitted',
  standalone: true,
  imports: [
    ReturnToTaskOrActionPageComponent,
    PageHeadingComponent,
    AerTotalEmissionsSummaryTemplateComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './aer-total-emissions-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerTotalEmissionsSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly totalEmissions = this.store.select(aerTimelineCommonQuery.selectTotalEmissions);

  readonly withReviewDecision = this.store.select(aerTimelineCommonQuery.withReviewDetermination);
  readonly decision = this.store.select(aerTimelineCommonQuery.selectSummaryReviewGroupDecision('TOTAL_EMISSIONS'));
}

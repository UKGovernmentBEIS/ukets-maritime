import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { opinionStatementMap } from '@requests/common/aer';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  EmpReviewDecisionSummaryTemplateComponent,
  OpinionStatementSummaryTemplateComponent,
} from '@shared/components';

@Component({
  selector: 'mrtm-opinion-statement-submitted',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    OpinionStatementSummaryTemplateComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './opinion-statement-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionStatementSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly opinionStatement = this.store.select(aerTimelineCommonQuery.selectOpinionStatement);
  readonly totalEmissions = this.store.select(aerTimelineCommonQuery.selectTotalEmissions);
  readonly monitoringPlanVersion = this.store.select(aerTimelineCommonQuery.selectMonitoringPlanVersion);
  readonly monitoringPlanChanges = this.store.select(aerTimelineCommonQuery.selectMonitoringPlanChanges);

  readonly map = opinionStatementMap;

  readonly withReviewDecision = this.store.select(aerTimelineCommonQuery.withReviewDetermination);
  readonly decision = this.store.select(aerTimelineCommonQuery.selectSummaryReviewGroupDecision('OPINION_STATEMENT'));
}

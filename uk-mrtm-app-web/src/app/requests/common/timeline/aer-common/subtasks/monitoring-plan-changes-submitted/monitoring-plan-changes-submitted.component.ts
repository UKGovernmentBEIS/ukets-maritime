import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { monitoringPlanChangesMap } from '@requests/common/aer';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  EmpReviewDecisionSummaryTemplateComponent,
  MonitoringPlanChangesSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-monitoring-plan-changes-submitted',
  standalone: true,
  imports: [
    ReturnToTaskOrActionPageComponent,
    PageHeadingComponent,
    MonitoringPlanChangesSummaryTemplateComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './monitoring-plan-changes-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonitoringPlanChangesSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly map = monitoringPlanChangesMap;

  readonly monitoringPlanVersion = this.store.select(aerTimelineCommonQuery.selectMonitoringPlanVersion);
  readonly monitoringPlanChanges = this.store.select(aerTimelineCommonQuery.selectMonitoringPlanChanges);

  readonly withReviewDecision = this.store.select(aerTimelineCommonQuery.withReviewDetermination);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('MONITORING_PLAN_CHANGES'),
  );
}

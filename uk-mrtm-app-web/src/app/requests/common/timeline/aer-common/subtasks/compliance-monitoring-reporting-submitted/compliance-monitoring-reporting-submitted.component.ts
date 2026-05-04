import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { complianceMonitoringReportingMap } from '@requests/common/aer';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  ComplianceMonitoringReportingSummaryTemplateComponent,
  ReviewDecisionSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-compliance-monitoring-reporting-submitted',
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    ComplianceMonitoringReportingSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './compliance-monitoring-reporting-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceMonitoringReportingSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly complianceMonitoringReporting = this.store.select(
    aerTimelineCommonQuery.selectComplianceMonitoringReporting,
  );
  readonly map = complianceMonitoringReportingMap;

  readonly isReviewCompletedActionType = this.store.select(aerTimelineCommonQuery.isReviewCompletedActionType);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('COMPLIANCE_MONITORING_REPORTING'),
  );
}

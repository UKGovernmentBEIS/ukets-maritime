import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { complianceMonitoringReportingMap } from '@requests/common/aer';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  ComplianceMonitoringReportingSummaryTemplateComponent,
  EmpReviewDecisionSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-compliance-monitoring-reporting-submitted',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    ComplianceMonitoringReportingSummaryTemplateComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './compliance-monitoring-reporting-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceMonitoringReportingSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly complianceMonitoringReporting = this.store.select(
    aerTimelineCommonQuery.selectComplianceMonitoringReporting,
  );
  readonly map = complianceMonitoringReportingMap;

  readonly withReviewDecision = this.store.select(aerTimelineCommonQuery.withReviewDetermination);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('COMPLIANCE_MONITORING_REPORTING'),
  );
}

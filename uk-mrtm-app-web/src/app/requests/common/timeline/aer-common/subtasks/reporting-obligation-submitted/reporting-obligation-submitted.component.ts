import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { reportingObligationMap } from '@requests/common/aer';
import { timelineCommonQuery } from '@requests/common/timeline';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  EmpReviewDecisionSummaryTemplateComponent,
  ReportingObligationSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-reporting-obligation-submitted',
  standalone: true,
  imports: [
    ReturnToTaskOrActionPageComponent,
    ReportingObligationSummaryTemplateComponent,
    PageHeadingComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './reporting-obligation-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingObligationSubmittedComponent {
  private readonly store = inject(RequestActionStore);

  readonly map = reportingObligationMap;
  readonly reportingYear = this.store.select(timelineCommonQuery.selectReportingYear);
  readonly reportingRequired = this.store.select(aerTimelineCommonQuery.selectReportingRequired);
  readonly reportingObligationDetails = this.store.select(aerTimelineCommonQuery.selectReportingObligationDetails);
  readonly supportingDocuments = this.store.select(
    aerTimelineCommonQuery.selectAttachedFiles(this.reportingObligationDetails()?.supportingDocuments),
  );

  readonly withReviewDecision = this.store.select(aerTimelineCommonQuery.withReviewDetermination);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('REPORTING_OBLIGATION_DETAILS'),
  );
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { etsComplianceRulesMap } from '@requests/common/aer';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  EmpReviewDecisionSummaryTemplateComponent,
  EtsComplianceRulesSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-ets-compliance-rules-submitted',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    EtsComplianceRulesSummaryTemplateComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './ets-compliance-rules-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EtsComplianceRulesSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly etsComplianceRules = this.store.select(aerTimelineCommonQuery.selectEtsComplianceRules);
  readonly map = etsComplianceRulesMap;

  readonly withReviewDecision = this.store.select(aerTimelineCommonQuery.withReviewDetermination);
  readonly decision = this.store.select(
    aerTimelineCommonQuery.selectSummaryReviewGroupDecision('ETS_COMPLIANCE_RULES'),
  );
}

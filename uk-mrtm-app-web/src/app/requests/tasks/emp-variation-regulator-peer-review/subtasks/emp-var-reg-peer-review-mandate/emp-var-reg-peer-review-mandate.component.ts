import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationRegulatorPeerReviewQuery } from '@requests/common/emp/+state';
import { mandateMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { MandateSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';

@Component({
  selector: 'mrtm-emp-var-reg-peer-review-mandate',
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
    MandateSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emp-var-reg-peer-review-mandate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarRegPeerReviewMandateComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  mandate = this.store.select(empCommonQuery.selectMandate)();
  originalMandate = this.store.select(empVariationRegulatorPeerReviewQuery.selectOriginalEmissionsMonitoringPlan)()
    ?.mandate;
  operatorName = this.store.select(empCommonQuery.selectOperatorDetails)()?.operatorName;
  originalOperatorName = this.store.select(empVariationRegulatorPeerReviewQuery.selectOriginalEmissionsMonitoringPlan)()
    ?.operatorDetails?.operatorName;
  variationDecisionDetails = this.store.select(empVariationRegulatorPeerReviewQuery.selectReviewGroupDecisions)()?.[
    'MANDATE'
  ];
  mandateMap = mandateMap;
}

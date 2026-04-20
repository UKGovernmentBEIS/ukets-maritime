import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAcceptedVariationDecisionDetails, EmpOperatorDetails, LimitedCompanyOrganisation } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationRegulatorPeerReviewQuery } from '@requests/common/emp/+state';
import { identifyMaritimeOperatorMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { OperatorDetailsSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { AttachedFile } from '@shared/types';

interface ViewModel {
  operatorDetails: EmpOperatorDetails;
  title: string;
  files: AttachedFile[];
  variationDecisionDetails: EmpAcceptedVariationDecisionDetails;
  originalOperatorDetails: EmpOperatorDetails;
  originalFiles: AttachedFile[];
}

@Component({
  selector: 'mrtm-emp-var-reg-peer-review-operator-details',
  standalone: true,
  imports: [
    PageHeadingComponent,
    OperatorDetailsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  templateUrl: './emp-var-reg-peer-review-operator-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarRegPeerReviewOperatorDetailsComponent {
  private readonly store = inject(RequestTaskStore);

  vm: Signal<ViewModel> = computed(() => {
    const originalOperatorDetails = this.store.select(
      empVariationRegulatorPeerReviewQuery.selectOriginalEmissionsMonitoringPlan,
    )().operatorDetails;
    const empOperatorDetails = this.store.select(empCommonQuery.selectOperatorDetails)();
    return {
      operatorDetails: empOperatorDetails,
      title: identifyMaritimeOperatorMap.title,
      files: this.store.select(
        empCommonQuery.selectAttachedFiles(
          (empOperatorDetails?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
        ),
      )(),
      variationDecisionDetails: this.store.select(empVariationRegulatorPeerReviewQuery.selectReviewGroupDecisions)()[
        'MARITIME_OPERATOR_DETAILS'
      ],
      originalOperatorDetails: originalOperatorDetails,
      originalFiles: this.store.select(
        empVariationRegulatorPeerReviewQuery.selectOriginalAttachedFiles(
          (originalOperatorDetails?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
        ),
      )(),
    };
  });
}

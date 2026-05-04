import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAcceptedVariationDecisionDetails, EmpManagementProcedures } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationRegulatorPeerReviewQuery } from '@requests/common/emp/+state';
import { managementProceduresMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { ManagementProceduresSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  managementProcedures: EmpManagementProcedures;
  originalManagementProcedures: EmpManagementProcedures;
  dataFlowFiles: AttachedFile[];
  originalDataFlowFiles: AttachedFile[];
  riskAssessmentFiles: AttachedFile[];
  originalRiskAssessmentFiles: AttachedFile[];
  variationDecisionDetails: EmpAcceptedVariationDecisionDetails;
  managementProceduresMap: SubTaskListMap<EmpManagementProcedures>;
}

@Component({
  selector: 'mrtm-emp-var-reg-peer-review-management-procedures',
  imports: [
    PageHeadingComponent,
    ManagementProceduresSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emp-var-reg-peer-review-management-procedures.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarRegPeerReviewManagementProceduresComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  readonly vm: Signal<ViewModel> = computed(() => {
    const managementProcedures = this.store.select(empCommonQuery.selectManagementProcedures)();
    const originalManagementProcedures = this.store.select(
      empVariationRegulatorPeerReviewQuery.selectOriginalEmissionsMonitoringPlan,
    )()?.managementProcedures;

    return {
      managementProcedures: managementProcedures,
      originalManagementProcedures: originalManagementProcedures,
      dataFlowFiles: this.store.select(
        empCommonQuery.selectAttachedFiles(managementProcedures?.dataFlowActivities?.files),
      )(),
      originalDataFlowFiles: this.store.select(
        empVariationRegulatorPeerReviewQuery.selectOriginalAttachedFiles(
          originalManagementProcedures?.dataFlowActivities?.files,
        ),
      )(),
      riskAssessmentFiles: this.store.select(
        empCommonQuery.selectAttachedFiles(managementProcedures?.riskAssessmentProcedures?.files),
      )(),
      originalRiskAssessmentFiles: this.store.select(
        empVariationRegulatorPeerReviewQuery.selectOriginalAttachedFiles(
          originalManagementProcedures?.riskAssessmentProcedures?.files,
        ),
      )(),
      variationDecisionDetails: this.store.select(empVariationRegulatorPeerReviewQuery.selectReviewGroupDecisions)()?.[
        'MANAGEMENT_PROCEDURES'
      ],
      managementProceduresMap: managementProceduresMap,
    };
  });
}

import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpAcceptedVariationDecisionDetails, EmpManagementProcedures } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';
import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { managementProceduresMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import {
  ManagementProceduresSummaryTemplateComponent,
  ReviewDecisionSummaryTemplateComponent,
} from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { AttachedFile, EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  managementProcedures: EmpManagementProcedures;
  managementProceduresMap: SubTaskListMap<EmpManagementProcedures>;
  dataFlowFiles: AttachedFile[];
  riskAssessmentFiles: AttachedFile[];
  reviewGroupDecision?: EmpVariationReviewDecisionDto | null;
  isVariationRegulator?: boolean;
  regulatorLedReason?: EmpAcceptedVariationDecisionDetails;
  isRegulator?: boolean;
}

@Component({
  selector: 'mrtm-emp-var-submitted-management-procedures',
  imports: [
    PageHeadingComponent,
    ManagementProceduresSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './emp-var-submitted-management-procedures.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedManagementProceduresComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  private readonly authStore: AuthStore = inject(AuthStore);

  vm: Signal<ViewModel> = computed(() => {
    const managementProcedures = this.store.select(empVariationSubmittedQuery.selectManagementProcedures)();
    return {
      managementProcedures: managementProcedures,
      managementProceduresMap: managementProceduresMap,
      dataFlowFiles: this.store.select(
        empVariationSubmittedQuery.selectAttachedFiles(managementProcedures?.dataFlowActivities?.files),
      )(),
      riskAssessmentFiles: this.store.select(
        empVariationSubmittedQuery.selectAttachedFiles(managementProcedures?.riskAssessmentProcedures?.files),
      )(),
      reviewGroupDecision: this.store.select(
        empVariationSubmittedQuery.selectReviewGroupDecision('managementProcedures'),
      )(),
      isVariationRegulator: this.store.select(empVariationSubmittedQuery.selectIsVariationRegulator)(),
      regulatorLedReason: this.store.select(
        empVariationSubmittedQuery.selectVariationRegulatorDecisionDetails('managementProcedures'),
      )(),
      isRegulator: this.authStore.select(selectUserRoleType)() === 'REGULATOR',
    };
  });
}

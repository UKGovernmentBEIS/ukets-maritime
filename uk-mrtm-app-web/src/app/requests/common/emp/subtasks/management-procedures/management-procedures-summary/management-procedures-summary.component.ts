import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmpAcceptedVariationDecisionDetails, EmpManagementProcedures } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import {
  empCommonQuery,
  empReviewQuery,
  empVariationRegulatorQuery,
  empVariationReviewQuery,
} from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import {
  MANAGEMENT_PROCEDURES_SUB_TASK,
  ManagementProceduresWizardStep,
} from '@requests/common/emp/subtasks/management-procedures';
import { managementProceduresMap } from '@requests/common/emp/subtasks/subtask-list.map';
import {
  ManagementProceduresSummaryTemplateComponent,
  ReviewDecisionSummaryTemplateComponent,
} from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { AttachedFile, EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  managementProcedures: EmpManagementProcedures;
  originalManagementProcedures: EmpManagementProcedures;
  dataFlowFiles: AttachedFile[];
  originalDataFlowFiles: AttachedFile[];
  riskAssessmentFiles: AttachedFile[];
  originalRiskAssessmentFiles: AttachedFile[];
  isVariationRegulatorDecision: boolean;
  variationDecisionDetails: EmpAcceptedVariationDecisionDetails;
  hasReview: boolean;
  empReviewDecisionDTO: EmpVariationReviewDecisionDto;
  managementProceduresMap: SubTaskListMap<EmpManagementProcedures>;
  isEditable: boolean;
  isSubTaskCompleted: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-management-procedures-summary',
  imports: [
    PageHeadingComponent,
    ManagementProceduresSummaryTemplateComponent,
    PendingButtonDirective,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './management-procedures-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementProceduresSummaryComponent {
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly vm: Signal<ViewModel> = computed(() => {
    const managementProcedures = this.store.select(empCommonQuery.selectManagementProcedures)();
    const originalManagementProcedures = this.store.select(
      empVariationRegulatorQuery.selectOriginalManagementProcedures,
    )();
    const hasReview = this.store.select(empCommonQuery.selectHasReview)();
    const isEditable = this.store.select(empCommonQuery.selectIsPeerReview)()
      ? false
      : this.store.select(requestTaskQuery.selectIsEditable)();
    const isSubTaskCompleted = hasReview
      ? this.store.select(empReviewQuery.selectIsSubtaskCompleted(MANAGEMENT_PROCEDURES_SUB_TASK))()
      : this.store.select(empCommonQuery.selectIsSubtaskCompleted(MANAGEMENT_PROCEDURES_SUB_TASK))();

    return {
      managementProcedures: managementProcedures,
      originalManagementProcedures: originalManagementProcedures,
      dataFlowFiles: this.store.select(
        empCommonQuery.selectAttachedFiles(managementProcedures?.dataFlowActivities?.files),
      )(),
      originalDataFlowFiles: this.store.select(
        empVariationRegulatorQuery.selectOriginalAttachedFiles(originalManagementProcedures?.dataFlowActivities?.files),
      )(),
      riskAssessmentFiles: this.store.select(
        empCommonQuery.selectAttachedFiles(managementProcedures?.riskAssessmentProcedures?.files),
      )(),
      originalRiskAssessmentFiles: this.store.select(
        empVariationRegulatorQuery.selectOriginalAttachedFiles(
          originalManagementProcedures?.riskAssessmentProcedures?.files,
        ),
      )(),
      variationDecisionDetails: this.store.select(
        empVariationRegulatorQuery.selectSubtaskVariationDecisionDetails(MANAGEMENT_PROCEDURES_SUB_TASK),
      )(),
      isVariationRegulatorDecision: this.store.select(empCommonQuery.selectIsVariationRegulator)(),
      hasReview: hasReview,
      empReviewDecisionDTO: this.store.select(
        empVariationReviewQuery.selectEmpReviewDecisionDTO(MANAGEMENT_PROCEDURES_SUB_TASK),
      )(),
      managementProceduresMap: managementProceduresMap,
      isEditable: isEditable,
      isSubTaskCompleted: isSubTaskCompleted,
      wizardStep: ManagementProceduresWizardStep,
    };
  });

  onSubmit() {
    this.service
      .submitSubtask(MANAGEMENT_PROCEDURES_SUB_TASK, ManagementProceduresWizardStep.SUMMARY, this.route)
      .subscribe();
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpManagementProcedures } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationReviewQuery } from '@requests/common/emp/+state';
import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import {
  MANAGEMENT_PROCEDURES_SUB_TASK,
  ManagementProceduresWizardStep,
} from '@requests/common/emp/subtasks/management-procedures';
import { managementProceduresMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewEmpSubtaskDecisionFormProvider,
  VARIATION_REVIEW_DECISION_FORM,
} from '@requests/tasks/emp-variation-review/components/review-decision';
import { EmpVariationReviewService } from '@requests/tasks/emp-variation-review/services';
import { ManagementProceduresSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  managementProcedures: EmpManagementProcedures;
  originalManagementProcedures: EmpManagementProcedures;
  dataFlowFiles: AttachedFile[];
  originalDataFlowFiles: AttachedFile[];
  riskAssessmentFiles: AttachedFile[];
  originalRiskAssessmentFiles: AttachedFile[];
  managementProceduresMap: SubTaskListMap<EmpManagementProcedures & { decision: string }>;
  isEditable: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-management-procedures-variation-review-decision',
  standalone: true,
  imports: [
    ManagementProceduresSummaryTemplateComponent,
    ReactiveFormsModule,
    WizardStepComponent,
    ReviewDecisionComponent,
  ],
  templateUrl: './management-procedures-variation-review-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [reviewEmpSubtaskDecisionFormProvider(MANAGEMENT_PROCEDURES_SUB_TASK)],
})
export class ManagementProceduresVariationReviewDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(VARIATION_REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpVariationReviewTaskPayload> = inject(
    TaskService<EmpVariationReviewTaskPayload>,
  );
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  vm: Signal<ViewModel> = computed(() => {
    const managementProcedures = this.store.select(empCommonQuery.selectManagementProcedures)();
    const originalManagementProcedures = this.store.select(
      empVariationReviewQuery.selectOriginalManagementProcedures,
    )();

    return {
      managementProcedures: managementProcedures,
      originalManagementProcedures: originalManagementProcedures,
      dataFlowFiles: this.store.select(
        empCommonQuery.selectAttachedFiles(managementProcedures?.dataFlowActivities?.files),
      )(),
      originalDataFlowFiles: this.store.select(
        empVariationReviewQuery.selectOriginalAttachedFiles(managementProcedures?.dataFlowActivities?.files),
      )(),
      riskAssessmentFiles: this.store.select(
        empCommonQuery.selectAttachedFiles(managementProcedures?.riskAssessmentProcedures?.files),
      )(),
      originalRiskAssessmentFiles: this.store.select(
        empVariationReviewQuery.selectOriginalAttachedFiles(managementProcedures?.riskAssessmentProcedures?.files),
      )(),
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      managementProceduresMap: managementProceduresMap,
      wizardStep: transformWizardStepDecision(ManagementProceduresWizardStep),
    };
  });

  onSubmit() {
    (this.service as EmpVariationReviewService)
      .saveReviewDecision(
        MANAGEMENT_PROCEDURES_SUB_TASK,
        ManagementProceduresWizardStep.DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[MANAGEMENT_PROCEDURES_SUB_TASK],
      )
      .subscribe();
  }
}

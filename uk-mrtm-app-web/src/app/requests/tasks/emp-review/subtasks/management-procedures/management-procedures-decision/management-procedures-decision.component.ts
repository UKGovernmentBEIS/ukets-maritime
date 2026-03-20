import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpManagementProcedures } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, EmpReviewTaskPayload } from '@requests/common';
import {
  MANAGEMENT_PROCEDURES_SUB_TASK,
  ManagementProceduresWizardStep,
} from '@requests/common/emp/subtasks/management-procedures';
import { managementProceduresMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  REVIEW_DECISION_FORM,
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewDecisionFormProvider,
} from '@requests/tasks/emp-review/components/review-decision';
import { EmpReviewService } from '@requests/tasks/emp-review/services';
import { ManagementProceduresSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  managementProcedures: EmpManagementProcedures;
  managementProceduresMap: SubTaskListMap<EmpManagementProcedures & { decision: string }>;
  dataFlowFiles: AttachedFile[];
  riskAssessmentFiles: AttachedFile[];
  isEditable: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-management-procedures-decision',
  imports: [
    ManagementProceduresSummaryTemplateComponent,
    ReactiveFormsModule,
    WizardStepComponent,
    ReviewDecisionComponent,
  ],
  standalone: true,
  templateUrl: './management-procedures-decision.component.html',
  providers: [reviewDecisionFormProvider(MANAGEMENT_PROCEDURES_SUB_TASK)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementProceduresDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpReviewTaskPayload> = inject(TaskService<EmpReviewTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly vm: Signal<ViewModel> = computed(() => {
    const managementProcedures = this.store.select(empCommonQuery.selectManagementProcedures)();
    return {
      managementProcedures: managementProcedures,
      managementProceduresMap: managementProceduresMap,
      dataFlowFiles: this.store.select(
        empCommonQuery.selectAttachedFiles(managementProcedures?.dataFlowActivities?.files),
      )(),
      riskAssessmentFiles: this.store.select(
        empCommonQuery.selectAttachedFiles(managementProcedures?.riskAssessmentProcedures?.files),
      )(),
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      wizardStep: transformWizardStepDecision(ManagementProceduresWizardStep),
    };
  });

  onSubmit() {
    (this.service as EmpReviewService)
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

import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpManagementProcedures } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationRegulatorQuery, EmpVariationRegulatorTaskPayload } from '@requests/common';
import {
  MANAGEMENT_PROCEDURES_SUB_TASK,
  ManagementProceduresWizardStep,
} from '@requests/common/emp/subtasks/management-procedures';
import { managementProceduresMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  VARIATION_REGULATOR_DECISION_FORM,
  VariationRegulatorDecisionComponent,
  VariationRegulatorDecisionFormModel,
  variationRegulatorDecisionFormProvider,
} from '@requests/tasks/emp-variation-regulator/components';
import { EmpVariationRegulatorService } from '@requests/tasks/emp-variation-regulator/services';
import { ManagementProceduresSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  managementProcedures: EmpManagementProcedures;
  originalManagementProcedures: EmpManagementProcedures;
  dataFlowFiles: AttachedFile[];
  originalDataFlowFiles: AttachedFile[];
  riskAssessmentFiles: AttachedFile[];
  originalRiskAssessmentFiles: AttachedFile[];
  managementProceduresMap: SubTaskListMap<
    EmpManagementProcedures & { variationRegulatorDecision: string; decision: string }
  >;
  isEditable: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-management-procedures-variation-regulator-decision',
  standalone: true,
  imports: [
    ManagementProceduresSummaryTemplateComponent,
    ReactiveFormsModule,
    WizardStepComponent,
    VariationRegulatorDecisionComponent,
  ],
  templateUrl: './management-procedures-variation-regulator-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [variationRegulatorDecisionFormProvider(MANAGEMENT_PROCEDURES_SUB_TASK)],
})
export class ManagementProceduresVariationRegulatorDecisionComponent {
  protected readonly form: VariationRegulatorDecisionFormModel = inject(VARIATION_REGULATOR_DECISION_FORM);
  private readonly service: TaskService<EmpVariationRegulatorTaskPayload> = inject(
    TaskService<EmpVariationRegulatorTaskPayload>,
  );
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  vm: Signal<ViewModel> = computed(() => {
    const managementProcedures = this.store.select(empCommonQuery.selectManagementProcedures)();
    const originalManagementProcedures = this.store.select(
      empVariationRegulatorQuery.selectOriginalManagementProcedures,
    )();

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
      managementProceduresMap: managementProceduresMap,
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      wizardStep: transformWizardStepDecision(ManagementProceduresWizardStep),
    };
  });

  onSubmit() {
    (this.service as EmpVariationRegulatorService)
      .saveVariationRegulatorDecision(
        MANAGEMENT_PROCEDURES_SUB_TASK,
        ManagementProceduresWizardStep.VARIATION_REGULATOR_DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[MANAGEMENT_PROCEDURES_SUB_TASK],
      )
      .subscribe();
  }
}

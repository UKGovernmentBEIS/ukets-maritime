import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpOperatorDetails, LimitedCompanyOrganisation } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationRegulatorQuery, EmpVariationRegulatorTaskPayload } from '@requests/common';
import { OPERATOR_DETAILS_SUB_TASK, OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import { identifyMaritimeOperatorMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import { variationRegulatorDecisionFormProvider } from '@requests/tasks/emp-variation-regulator/components';
import {
  VARIATION_REGULATOR_DECISION_FORM,
  VariationRegulatorDecisionComponent,
  VariationRegulatorDecisionFormModel,
} from '@requests/tasks/emp-variation-regulator/components/variation-regulator-decision';
import { EmpVariationRegulatorService } from '@requests/tasks/emp-variation-regulator/services';
import { OperatorDetailsSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  operatorDetails: EmpOperatorDetails;
  originalOperatorDetails: EmpOperatorDetails;
  operatorDetailsMap: SubTaskListMap<{
    operatorDetails: string;
    undertakenActivities: string;
    declarationDocuments: string;
    legalStatusOfOrganisation: string;
    organisationDetails: string;
    variationRegulatorDecision: string;
    decision: string;
  }>;
  files: AttachedFile[];
  originalFiles: AttachedFile[];
  isEditable: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-operator-details-variation-regulator-decision',
  imports: [
    OperatorDetailsSummaryTemplateComponent,
    WizardStepComponent,
    ReactiveFormsModule,
    VariationRegulatorDecisionComponent,
  ],
  standalone: true,
  templateUrl: './operator-details-variation-regulator-decision.component.html',
  providers: [variationRegulatorDecisionFormProvider(OPERATOR_DETAILS_SUB_TASK)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorDetailsVariationRegulatorDecisionComponent {
  protected readonly form: VariationRegulatorDecisionFormModel = inject(VARIATION_REGULATOR_DECISION_FORM);
  private readonly service: TaskService<EmpVariationRegulatorTaskPayload> = inject(
    TaskService<EmpVariationRegulatorTaskPayload>,
  );
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly vm: Signal<ViewModel> = computed(() => {
    const empOperatorDetails = this.store.select(empCommonQuery.selectOperatorDetails)();
    const originalOperatorDetails = this.store.select(empVariationRegulatorQuery.selectOriginalOperatorDetails)();

    return {
      operatorDetails: empOperatorDetails,
      originalOperatorDetails: originalOperatorDetails,
      operatorDetailsMap: identifyMaritimeOperatorMap,
      files: this.store.select(
        empCommonQuery.selectAttachedFiles(
          (empOperatorDetails.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
        ),
      )(),
      originalFiles: this.store.select(
        empVariationRegulatorQuery.selectOriginalAttachedFiles(
          (originalOperatorDetails?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
        ),
      )(),
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      wizardStep: transformWizardStepDecision(OperatorDetailsWizardStep),
    };
  });

  onSubmit() {
    (this.service as EmpVariationRegulatorService)
      .saveVariationRegulatorDecision(
        OPERATOR_DETAILS_SUB_TASK,
        OperatorDetailsWizardStep.VARIATION_REGULATOR_DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[OPERATOR_DETAILS_SUB_TASK],
      )
      .subscribe();
  }
}

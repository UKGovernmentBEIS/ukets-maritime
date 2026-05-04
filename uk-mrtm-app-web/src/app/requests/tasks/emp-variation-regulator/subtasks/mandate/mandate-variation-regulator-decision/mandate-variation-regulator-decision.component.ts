import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationRegulatorQuery, EmpVariationRegulatorTaskPayload } from '@requests/common';
import { MANDATE_SUB_TASK, MandateWizardStep } from '@requests/common/emp/subtasks/mandate';
import { mandateMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  VARIATION_REGULATOR_DECISION_FORM,
  VariationRegulatorDecisionComponent,
  VariationRegulatorDecisionFormModel,
  variationRegulatorDecisionFormProvider,
} from '@requests/tasks/emp-variation-regulator/components';
import { EmpVariationRegulatorService } from '@requests/tasks/emp-variation-regulator/services';
import { MandateSummaryTemplateComponent, WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-mandate-variation-regulator-decision',
  imports: [
    VariationRegulatorDecisionComponent,
    WizardStepComponent,
    MandateSummaryTemplateComponent,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './mandate-variation-regulator-decision.component.html',
  providers: [variationRegulatorDecisionFormProvider(MANDATE_SUB_TASK)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateVariationRegulatorDecisionComponent {
  protected readonly form: VariationRegulatorDecisionFormModel = inject(VARIATION_REGULATOR_DECISION_FORM);
  private readonly service: TaskService<EmpVariationRegulatorTaskPayload> = inject(
    TaskService<EmpVariationRegulatorTaskPayload>,
  );
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly mandate = this.store.select(empCommonQuery.selectMandate)();
  readonly originalMandate = this.store.select(empVariationRegulatorQuery.selectOriginalMandate)();
  readonly operatorName = this.store.select(empCommonQuery.selectOperatorDetails)()?.operatorName;
  readonly originalOperatorName = this.store.select(empVariationRegulatorQuery.selectOriginalOperatorDetails)()
    ?.operatorName;

  readonly mandateMap = mandateMap;
  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable)();
  readonly wizardStep = transformWizardStepDecision(MandateWizardStep);

  onSubmit() {
    (this.service as EmpVariationRegulatorService)
      .saveVariationRegulatorDecision(
        MANDATE_SUB_TASK,
        MandateWizardStep.VARIATION_REGULATOR_DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[MANDATE_SUB_TASK],
      )
      .subscribe();
  }
}

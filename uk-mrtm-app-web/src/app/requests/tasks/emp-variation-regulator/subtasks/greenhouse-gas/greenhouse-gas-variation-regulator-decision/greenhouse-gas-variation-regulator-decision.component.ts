import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpMonitoringGreenhouseGas } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationRegulatorQuery } from '@requests/common/emp/+state';
import { EmpVariationRegulatorTaskPayload } from '@requests/common/emp/emp.types';
import { GREENHOUSE_GAS_SUB_TASK, GreenhouseGasWizardStep } from '@requests/common/emp/subtasks/greenhouse-gas';
import { greenhouseGasMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  VARIATION_REGULATOR_DECISION_FORM,
  VariationRegulatorDecisionComponent,
  VariationRegulatorDecisionFormModel,
  variationRegulatorDecisionFormProvider,
} from '@requests/tasks/emp-variation-regulator/components';
import { EmpVariationRegulatorService } from '@requests/tasks/emp-variation-regulator/services';
import { GreenhousesSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  greenhouseGas: EmpMonitoringGreenhouseGas;
  originalGreenhouseGas: EmpMonitoringGreenhouseGas;
  greenhouseGasMap: SubTaskListMap<
    EmpMonitoringGreenhouseGas & { variationRegulatorDecision: string; decision: string }
  >;
  isEditable: boolean;
  wizardStep?: { [s: string]: string };
}

@Component({
  selector: 'mrtm-greenhouse-gas-variation-regulator-decision',
  standalone: true,
  imports: [
    GreenhousesSummaryTemplateComponent,
    ReactiveFormsModule,
    WizardStepComponent,
    VariationRegulatorDecisionComponent,
  ],
  templateUrl: './greenhouse-gas-variation-regulator-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [variationRegulatorDecisionFormProvider(GREENHOUSE_GAS_SUB_TASK)],
})
export class GreenhouseGasVariationRegulatorDecisionComponent {
  protected readonly form: VariationRegulatorDecisionFormModel = inject(VARIATION_REGULATOR_DECISION_FORM);
  private readonly service: TaskService<EmpVariationRegulatorTaskPayload> = inject(
    TaskService<EmpVariationRegulatorTaskPayload>,
  );
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  vm: Signal<ViewModel> = computed(() => ({
    greenhouseGas: this.store.select(empCommonQuery.selectGreenhouseGas)(),
    originalGreenhouseGas: this.store.select(empVariationRegulatorQuery.selectOriginalGreenhouseGas)(),
    greenhouseGasMap: greenhouseGasMap,
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    wizardStep: transformWizardStepDecision(GreenhouseGasWizardStep),
  }));

  onSubmit() {
    (this.service as EmpVariationRegulatorService)
      .saveVariationRegulatorDecision(
        GREENHOUSE_GAS_SUB_TASK,
        GreenhouseGasWizardStep.VARIATION_REGULATOR_DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[GREENHOUSE_GAS_SUB_TASK],
      )
      .subscribe();
  }
}

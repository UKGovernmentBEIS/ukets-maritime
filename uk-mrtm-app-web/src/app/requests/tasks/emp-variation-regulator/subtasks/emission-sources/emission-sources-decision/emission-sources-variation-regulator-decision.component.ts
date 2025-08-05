import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpEmissionSources } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationRegulatorQuery } from '@requests/common/emp/+state';
import { EmpVariationRegulatorTaskPayload } from '@requests/common/emp/emp.types';
import { EMISSION_SOURCES_SUB_TASK, EmissionSourcesWizardStep } from '@requests/common/emp/subtasks/emission-sources';
import { emissionSourcesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  VARIATION_REGULATOR_DECISION_FORM,
  VariationRegulatorDecisionComponent,
  VariationRegulatorDecisionFormModel,
  variationRegulatorDecisionFormProvider,
} from '@requests/tasks/emp-variation-regulator/components';
import { EmpVariationRegulatorService } from '@requests/tasks/emp-variation-regulator/services';
import { EmissionSourcesSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  emissionSources: EmpEmissionSources;
  originalEmissionSources: EmpEmissionSources;
  emissionSourcesMap: SubTaskListMap<EmpEmissionSources & { variationRegulatorDecision: string; decision: string }>;
  isEditable: boolean;
  wizardStep: { [key: string]: string };
}

@Component({
  selector: 'mrtm-emission-sources-variation-regulator-decision',
  standalone: true,
  imports: [
    EmissionSourcesSummaryTemplateComponent,
    ReactiveFormsModule,
    WizardStepComponent,
    VariationRegulatorDecisionComponent,
  ],
  templateUrl: './emission-sources-variation-regulator-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [variationRegulatorDecisionFormProvider(EMISSION_SOURCES_SUB_TASK)],
})
export class EmissionSourcesVariationRegulatorDecisionComponent {
  protected readonly form: VariationRegulatorDecisionFormModel = inject(VARIATION_REGULATOR_DECISION_FORM);
  private readonly service: TaskService<EmpVariationRegulatorTaskPayload> = inject(
    TaskService<EmpVariationRegulatorTaskPayload>,
  );
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  vm: Signal<ViewModel> = computed(() => {
    return {
      emissionSources: this.store.select(empCommonQuery.selectEmissionSources)(),
      originalEmissionSources: this.store.select(empVariationRegulatorQuery.selectOriginalEmissionSources)(),
      emissionSourcesMap: emissionSourcesMap,
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      wizardStep: transformWizardStepDecision(EmissionSourcesWizardStep),
    };
  });

  onSubmit() {
    (this.service as EmpVariationRegulatorService)
      .saveVariationRegulatorDecision(
        EMISSION_SOURCES_SUB_TASK,
        EmissionSourcesWizardStep.VARIATION_REGULATOR_DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[EMISSION_SOURCES_SUB_TASK],
      )
      .subscribe();
  }
}

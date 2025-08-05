import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpEmissionSources } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationReviewQuery } from '@requests/common/emp/+state';
import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import { EMISSION_SOURCES_SUB_TASK, EmissionSourcesWizardStep } from '@requests/common/emp/subtasks/emission-sources';
import { emissionSourcesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewEmpSubtaskDecisionFormProvider,
  VARIATION_REVIEW_DECISION_FORM,
} from '@requests/tasks/emp-variation-review/components/review-decision';
import { EmpVariationReviewService } from '@requests/tasks/emp-variation-review/services';
import { EmissionSourcesSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  emissionSources: EmpEmissionSources;
  originalEmissionSources: EmpEmissionSources;
  emissionSourcesMap: SubTaskListMap<EmpEmissionSources & { decision: string }>;
  isEditable: boolean;
  wizardStep: { [key: string]: string };
}

@Component({
  selector: 'mrtm-emission-sources-variation-review-decision',
  standalone: true,
  imports: [EmissionSourcesSummaryTemplateComponent, ReactiveFormsModule, WizardStepComponent, ReviewDecisionComponent],
  templateUrl: './emission-sources-variation-review-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [reviewEmpSubtaskDecisionFormProvider(EMISSION_SOURCES_SUB_TASK)],
})
export class EmissionSourcesVariationReviewDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(VARIATION_REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpVariationReviewTaskPayload> = inject(
    TaskService<EmpVariationReviewTaskPayload>,
  );
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  vm: Signal<ViewModel> = computed(() => {
    return {
      emissionSources: this.store.select(empCommonQuery.selectEmissionSources)(),
      originalEmissionSources: this.store.select(empVariationReviewQuery.selectOriginalEmissionSources)(),
      emissionSourcesMap: emissionSourcesMap,
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      wizardStep: transformWizardStepDecision(EmissionSourcesWizardStep),
    };
  });

  onSubmit() {
    (this.service as EmpVariationReviewService)
      .saveReviewDecision(
        EMISSION_SOURCES_SUB_TASK,
        EmissionSourcesWizardStep.DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[EMISSION_SOURCES_SUB_TASK],
      )
      .subscribe();
  }
}

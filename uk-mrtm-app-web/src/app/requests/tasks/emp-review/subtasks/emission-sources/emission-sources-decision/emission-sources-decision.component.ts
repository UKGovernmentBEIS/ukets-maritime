import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpEmissionSources } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpReviewTaskPayload } from '@requests/common/emp/emp.types';
import { EMISSION_SOURCES_SUB_TASK, EmissionSourcesWizardStep } from '@requests/common/emp/subtasks/emission-sources';
import { emissionSourcesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  REVIEW_DECISION_FORM,
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewDecisionFormProvider,
} from '@requests/tasks/emp-review/components/review-decision';
import { EmpReviewService } from '@requests/tasks/emp-review/services';
import { EmissionSourcesSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  emissionSources: EmpEmissionSources;
  emissionSourcesMap: SubTaskListMap<EmpEmissionSources & { decision: string }>;
  isEditable: boolean;
  wizardStep: { [key: string]: string };
}

@Component({
  selector: 'mrtm-emission-sources-decision',
  imports: [EmissionSourcesSummaryTemplateComponent, ReactiveFormsModule, WizardStepComponent, ReviewDecisionComponent],
  standalone: true,
  templateUrl: './emission-sources-decision.component.html',
  providers: [reviewDecisionFormProvider(EMISSION_SOURCES_SUB_TASK)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionSourcesDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpReviewTaskPayload> = inject(TaskService<EmpReviewTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly vm: Signal<ViewModel> = computed(() => {
    return {
      emissionSources: this.store.select(empCommonQuery.selectEmissionSources)(),
      emissionSourcesMap: emissionSourcesMap,
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      wizardStep: transformWizardStepDecision(EmissionSourcesWizardStep),
    };
  });

  onSubmit() {
    (this.service as EmpReviewService)
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

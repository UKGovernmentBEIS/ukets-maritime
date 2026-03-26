import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpControlActivities } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, EmpReviewTaskPayload } from '@requests/common';
import {
  CONTROL_ACTIVITIES_SUB_TASK,
  ControlActivitiesWizardStep,
} from '@requests/common/emp/subtasks/control-activities';
import { controlActivitiesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  REVIEW_DECISION_FORM,
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewDecisionFormProvider,
} from '@requests/tasks/emp-review/components/review-decision';
import { EmpReviewService } from '@requests/tasks/emp-review/services';
import { ControlActivitiesSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  controlActivities: EmpControlActivities;
  controlActivitiesMap: SubTaskListMap<EmpControlActivities & { decision: string }>;
  isEditable: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-control-activities-decision',
  imports: [
    ControlActivitiesSummaryTemplateComponent,
    ReactiveFormsModule,
    WizardStepComponent,
    ReviewDecisionComponent,
  ],
  standalone: true,
  templateUrl: './control-activities-decision.component.html',
  providers: [reviewDecisionFormProvider(CONTROL_ACTIVITIES_SUB_TASK)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlActivitiesDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpReviewTaskPayload> = inject(TaskService<EmpReviewTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly vm: Signal<ViewModel> = computed(() => {
    return {
      controlActivities: this.store.select(empCommonQuery.selectControlActivities)(),
      controlActivitiesMap: controlActivitiesMap,
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      wizardStep: transformWizardStepDecision(ControlActivitiesWizardStep),
    };
  });

  onSubmit() {
    (this.service as EmpReviewService)
      .saveReviewDecision(
        CONTROL_ACTIVITIES_SUB_TASK,
        ControlActivitiesWizardStep.DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[CONTROL_ACTIVITIES_SUB_TASK],
      )
      .subscribe();
  }
}

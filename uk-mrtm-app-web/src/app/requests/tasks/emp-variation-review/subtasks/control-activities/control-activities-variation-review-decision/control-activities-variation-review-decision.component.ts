import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpControlActivities } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationReviewQuery } from '@requests/common/emp/+state';
import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import {
  CONTROL_ACTIVITIES_SUB_TASK,
  ControlActivitiesWizardStep,
} from '@requests/common/emp/subtasks/control-activities';
import { controlActivitiesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewEmpSubtaskDecisionFormProvider,
  VARIATION_REVIEW_DECISION_FORM,
} from '@requests/tasks/emp-variation-review/components/review-decision';
import { EmpVariationReviewService } from '@requests/tasks/emp-variation-review/services';
import { ControlActivitiesSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  controlActivities: EmpControlActivities;
  originalControlActivities: EmpControlActivities;
  controlActivitiesMap: SubTaskListMap<EmpControlActivities & { decision: string }>;
  isEditable: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-control-activities-variation-review-decision',
  standalone: true,
  imports: [
    ControlActivitiesSummaryTemplateComponent,
    ReactiveFormsModule,
    WizardStepComponent,
    ReviewDecisionComponent,
  ],
  templateUrl: './control-activities-variation-review-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [reviewEmpSubtaskDecisionFormProvider(CONTROL_ACTIVITIES_SUB_TASK)],
})
export class ControlActivitiesVariationReviewDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(VARIATION_REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpVariationReviewTaskPayload> = inject(
    TaskService<EmpVariationReviewTaskPayload>,
  );
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  vm: Signal<ViewModel> = computed(() => {
    return {
      controlActivities: this.store.select(empCommonQuery.selectControlActivities)(),
      originalControlActivities: this.store.select(empVariationReviewQuery.selectOriginalControlActivities)(),
      controlActivitiesMap: controlActivitiesMap,
      isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
      wizardStep: transformWizardStepDecision(ControlActivitiesWizardStep),
    };
  });

  onSubmit() {
    (this.service as EmpVariationReviewService)
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

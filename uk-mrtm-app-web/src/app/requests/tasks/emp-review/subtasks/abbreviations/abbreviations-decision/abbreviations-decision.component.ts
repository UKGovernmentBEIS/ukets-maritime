import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpAbbreviations } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpReviewTaskPayload } from '@requests/common/emp/emp.types';
import { ABBREVIATIONS_SUB_TASK, AbbreviationsWizardStep } from '@requests/common/emp/subtasks/abbreviations';
import { abbreviationsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  REVIEW_DECISION_FORM,
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewDecisionFormProvider,
} from '@requests/tasks/emp-review/components/review-decision';
import { EmpReviewService } from '@requests/tasks/emp-review/services';
import { AbbreviationsSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  abbreviations: EmpAbbreviations;
  abbreviationsMap: SubTaskListMap<{ abbreviationsQuestion: string; decision: string }>;
  isEditable: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-abbreviations-decision',
  imports: [AbbreviationsSummaryTemplateComponent, ReviewDecisionComponent, WizardStepComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './abbreviations-decision.component.html',
  providers: [reviewDecisionFormProvider(ABBREVIATIONS_SUB_TASK)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbbreviationsDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpReviewTaskPayload> = inject(TaskService<EmpReviewTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly vm: Signal<ViewModel> = computed(() => ({
    abbreviations: this.store.select(empCommonQuery.selectAbbreviations)(),
    abbreviationsMap: abbreviationsMap,
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    wizardStep: transformWizardStepDecision(AbbreviationsWizardStep),
  }));

  onSubmit() {
    (this.service as EmpReviewService)
      .saveReviewDecision(
        ABBREVIATIONS_SUB_TASK,
        AbbreviationsWizardStep.DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[ABBREVIATIONS_SUB_TASK],
      )
      .subscribe();
  }
}

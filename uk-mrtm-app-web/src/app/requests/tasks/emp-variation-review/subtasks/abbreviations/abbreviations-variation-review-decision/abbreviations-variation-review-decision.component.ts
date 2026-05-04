import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpAbbreviations } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationReviewQuery } from '@requests/common/emp/+state';
import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import { ABBREVIATIONS_SUB_TASK, AbbreviationsWizardStep } from '@requests/common/emp/subtasks/abbreviations';
import { abbreviationsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewEmpSubtaskDecisionFormProvider,
  VARIATION_REVIEW_DECISION_FORM,
} from '@requests/tasks/emp-variation-review/components/review-decision';
import { EmpVariationReviewService } from '@requests/tasks/emp-variation-review/services';
import { AbbreviationsSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  abbreviations: EmpAbbreviations;
  originalAbbreviations: EmpAbbreviations;
  abbreviationsMap: SubTaskListMap<{ abbreviationsQuestion: string; decision: string }>;
  isEditable: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-abbreviations-variation-review-decision',
  imports: [AbbreviationsSummaryTemplateComponent, ReviewDecisionComponent, WizardStepComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './abbreviations-variation-review-decision.component.html',
  providers: [reviewEmpSubtaskDecisionFormProvider(ABBREVIATIONS_SUB_TASK)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbbreviationsVariationReviewDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(VARIATION_REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpVariationReviewTaskPayload> = inject(
    TaskService<EmpVariationReviewTaskPayload>,
  );
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly vm: Signal<ViewModel> = computed(() => ({
    abbreviations: this.store.select(empCommonQuery.selectAbbreviations)(),
    originalAbbreviations: this.store.select(empVariationReviewQuery.selectOriginalAbbreviations)(),
    abbreviationsMap: abbreviationsMap,
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    wizardStep: transformWizardStepDecision(AbbreviationsWizardStep),
  }));

  onSubmit() {
    (this.service as EmpVariationReviewService)
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

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery, empVariationReviewQuery } from '@requests/common/emp/+state';
import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import { MANDATE_SUB_TASK, MandateWizardStep } from '@requests/common/emp/subtasks/mandate';
import { mandateMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewEmpSubtaskDecisionFormProvider,
  VARIATION_REVIEW_DECISION_FORM,
} from '@requests/tasks/emp-variation-review/components/review-decision';
import { EmpVariationReviewService } from '@requests/tasks/emp-variation-review/services';
import { MandateSummaryTemplateComponent, WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-mandate-variation-review-decision',
  standalone: true,
  imports: [ReviewDecisionComponent, WizardStepComponent, MandateSummaryTemplateComponent, ReactiveFormsModule],
  templateUrl: './mandate-variation-review-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [reviewEmpSubtaskDecisionFormProvider(MANDATE_SUB_TASK)],
})
export class MandateVariationReviewDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(VARIATION_REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpVariationReviewTaskPayload> = inject(
    TaskService<EmpVariationReviewTaskPayload>,
  );
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  mandateMap = mandateMap;
  mandate = this.store.select(empCommonQuery.selectMandate)();
  originalMandate = this.store.select(empVariationReviewQuery.selectOriginalMandate)();
  operatorName = this.store.select(empCommonQuery.selectOperatorDetails)()?.operatorName;
  originalOperatorName = this.store.select(empVariationReviewQuery.selectOriginalOperatorDetails)()?.operatorName;
  isEditable = this.store.select(requestTaskQuery.selectIsEditable)();
  wizardStep = transformWizardStepDecision(MandateWizardStep);

  onSubmit() {
    (this.service as EmpVariationReviewService)
      .saveReviewDecision(
        MANDATE_SUB_TASK,
        MandateWizardStep.DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[MANDATE_SUB_TASK],
      )
      .subscribe();
  }
}

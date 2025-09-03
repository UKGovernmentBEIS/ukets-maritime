import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { EmpMandate } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import { empCommonQuery, EmpReviewTaskPayload } from '@requests/common';
import { MANDATE_SUB_TASK, mandateSubtaskMap, MandateWizardStep } from '@requests/common/emp/subtasks/mandate';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import {
  REVIEW_DECISION_FORM,
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewDecisionFormProvider,
} from '@requests/tasks/emp-review/components';
import { EmpReviewService } from '@requests/tasks/emp-review/services';
import {
  MandateRegisteredOwnersListSummaryTemplateComponent,
  MandateResponsibilityDeclarationSummaryTemplateComponent,
  MandateResponsibilitySummaryTemplateComponent,
  WizardStepComponent,
} from '@shared/components';

@Component({
  selector: 'mrtm-mandate-decision',
  standalone: true,
  imports: [
    WizardStepComponent,
    ReactiveFormsModule,
    ReviewDecisionComponent,
    MandateResponsibilitySummaryTemplateComponent,
    MandateRegisteredOwnersListSummaryTemplateComponent,
    MandateResponsibilityDeclarationSummaryTemplateComponent,
    RouterLink,
    LinkDirective,
  ],
  providers: [reviewDecisionFormProvider(MANDATE_SUB_TASK)],
  templateUrl: './mandate-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpReviewTaskPayload> = inject(TaskService<EmpReviewTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  public readonly isEditable: Signal<boolean> = this.store.select(requestTaskQuery.selectIsEditable);
  public readonly mandate: Signal<EmpMandate> = this.store.select(empCommonQuery.selectMandate);
  public readonly wizardMap = mandateSubtaskMap;
  public readonly wizardStep = MandateWizardStep;

  public onSubmit(): void {
    (this.service as EmpReviewService)
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

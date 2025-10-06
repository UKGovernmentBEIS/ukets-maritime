import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { EmpMandate, EmpOperatorDetails } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import { empCommonQuery, EmpReviewTaskPayload } from '@requests/common';
import { MANDATE_SUB_TASK, MandateWizardStep } from '@requests/common/emp/subtasks/mandate';
import { mandateMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  REVIEW_DECISION_FORM,
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewDecisionFormProvider,
} from '@requests/tasks/emp-review/components';
import { EmpReviewService } from '@requests/tasks/emp-review/services';
import { MandateSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { MandateRegisteredOwnersListSummaryTemplateComponent } from '@shared/components/summaries/emp/mandate/mandate-registered-owners-list-summary-template';
import { MandateResponsibilityDeclarationSummaryTemplateComponent } from '@shared/components/summaries/emp/mandate/mandate-responsibility-declaration-summary-template';
import { MandateResponsibilitySummaryTemplateComponent } from '@shared/components/summaries/emp/mandate/mandate-responsibility-summary-template';

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
    MandateSummaryTemplateComponent,
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
  public readonly operatorName: Signal<EmpOperatorDetails['operatorName']> = computed(
    () => this.store.select(empCommonQuery.selectOperatorDetails)()?.operatorName,
  );
  public readonly wizardMap = mandateMap;
  public readonly wizardStep = transformWizardStepDecision(MandateWizardStep);

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

  protected readonly mandateMap = mandateMap;
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import { empCommonQuery, EmpReviewTaskPayload } from '@requests/common';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { emissionsSubTasksMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  REVIEW_DECISION_FORM,
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewDecisionFormProvider,
} from '@requests/tasks/emp-review/components/review-decision';
import { EmpReviewService } from '@requests/tasks/emp-review/services';
import { WizardStepComponent } from '@shared/components';
import { ListOfShipsSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-list-of-ships-summary',
  standalone: true,
  imports: [
    ListOfShipsSummaryTemplateComponent,
    RouterLink,
    LinkDirective,
    ReactiveFormsModule,
    WizardStepComponent,
    ReviewDecisionComponent,
  ],
  templateUrl: './list-of-ships-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [reviewDecisionFormProvider(EMISSIONS_SUB_TASK)],
})
export class ListOfShipsDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(REVIEW_DECISION_FORM);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service: TaskService<EmpReviewTaskPayload> = inject(TaskService<EmpReviewTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  ships = this.store.select(empCommonQuery.selectListOfShips)();
  isEditable = this.store.select(requestTaskQuery.selectIsEditable)();
  wizardStep = transformWizardStepDecision(EmissionsWizardStep);
  emissionsSubTasksMap = emissionsSubTasksMap;

  onSubmit() {
    (this.service as EmpReviewService)
      .saveReviewDecision(
        EMISSIONS_SUB_TASK,
        EmissionsWizardStep.DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[EMISSIONS_SUB_TASK],
      )
      .subscribe();
  }
}

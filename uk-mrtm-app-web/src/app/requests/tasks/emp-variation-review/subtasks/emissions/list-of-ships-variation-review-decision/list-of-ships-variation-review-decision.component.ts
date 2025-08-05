import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { empCommonQuery, empVariationReviewQuery } from '@requests/common/emp/+state';
import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { emissionsSubTasksMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewEmpSubtaskDecisionFormProvider,
  VARIATION_REVIEW_DECISION_FORM,
} from '@requests/tasks/emp-variation-review/components/review-decision';
import { EmpVariationReviewService } from '@requests/tasks/emp-variation-review/services';
import { WizardStepComponent } from '@shared/components';
import { ListOfShipsSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-list-of-ships-variation-review-decision',
  standalone: true,
  imports: [
    ListOfShipsSummaryTemplateComponent,
    RouterLink,
    LinkDirective,
    ReactiveFormsModule,
    WizardStepComponent,
    ReviewDecisionComponent,
  ],
  templateUrl: './list-of-ships-variation-review-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [reviewEmpSubtaskDecisionFormProvider(EMISSIONS_SUB_TASK)],
})
export class ListOfShipsVariationReviewDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(VARIATION_REVIEW_DECISION_FORM);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service: TaskService<EmpVariationReviewTaskPayload> = inject(
    TaskService<EmpVariationReviewTaskPayload>,
  );
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  wizardStep = transformWizardStepDecision(EmissionsWizardStep);
  emissionsSubTasksMap = emissionsSubTasksMap;
  ships = this.store.select(empCommonQuery.selectListOfShips)();
  originalShips = this.store.select(empVariationReviewQuery.selectOriginalListOfShips)();
  isEditable = this.store.select(requestTaskQuery.selectIsEditable)();

  onSubmit() {
    (this.service as EmpVariationReviewService)
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

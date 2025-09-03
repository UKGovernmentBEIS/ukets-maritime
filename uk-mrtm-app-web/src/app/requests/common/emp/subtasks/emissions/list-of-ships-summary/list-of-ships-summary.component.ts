import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import {
  empCommonQuery,
  empReviewQuery,
  empVariationRegulatorQuery,
  empVariationReviewQuery,
} from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import {
  ListOfShipsSummaryTemplateComponent,
  ReviewDecisionSummaryTemplateComponent,
} from '@shared/components/summaries';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';

@Component({
  selector: 'mrtm-list-of-ships-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ListOfShipsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ButtonDirective,
    RouterLink,
    LinkDirective,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './list-of-ships-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfShipsSummaryComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly taskService: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  hasReview = this.store.select(empCommonQuery.selectHasReview)();
  ships = this.store.select(empCommonQuery.selectListOfShips)();
  originalShips = this.store.select(empVariationRegulatorQuery.selectOriginalListOfShips)();
  variationDecisionDetails = this.store.select(
    empVariationRegulatorQuery.selectSubtaskVariationDecisionDetails(EMISSIONS_SUB_TASK),
  )();
  isVariationRegulatorDecision = this.store.select(empCommonQuery.selectIsVariationRegulator)();
  empReviewDecisionDTO = this.store.select(empVariationReviewQuery.selectEmpReviewDecisionDTO(EMISSIONS_SUB_TASK))();
  isEditable = this.store.select(empCommonQuery.selectIsPeerReview)()
    ? false
    : this.store.select(requestTaskQuery.selectIsEditable)();
  isSubTaskCompleted = this.hasReview
    ? this.store.select(empReviewQuery.selectIsSubtaskCompleted(EMISSIONS_SUB_TASK))()
    : this.store.select(empCommonQuery.selectIsSubtaskCompleted(EMISSIONS_SUB_TASK))();
  wizardStep = EmissionsWizardStep;

  onSubmit() {
    this.taskService.submitSubtask(EMISSIONS_SUB_TASK, EmissionsWizardStep.SUMMARY, this.activatedRoute).subscribe();
  }
}

import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmpAcceptedVariationDecisionDetails, EmpControlActivities } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import {
  empCommonQuery,
  empReviewQuery,
  empVariationRegulatorQuery,
  empVariationReviewQuery,
} from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import {
  CONTROL_ACTIVITIES_SUB_TASK,
  ControlActivitiesWizardStep,
} from '@requests/common/emp/subtasks/control-activities';
import { controlActivitiesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { ControlActivitiesSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';
import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template';
import { EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  controlActivities: EmpControlActivities;
  originalControlActivities: EmpControlActivities;
  isVariationRegulatorDecision: boolean;
  variationDecisionDetails: EmpAcceptedVariationDecisionDetails;
  hasReview: boolean;
  empReviewDecisionDTO: EmpVariationReviewDecisionDto;
  controlActivitiesMap: SubTaskListMap<EmpControlActivities>;
  isEditable: boolean;
  isSubTaskCompleted: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-control-activities-summary',
  imports: [
    PageHeadingComponent,
    ControlActivitiesSummaryTemplateComponent,
    PendingButtonDirective,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
    VariationRegulatorDecisionPartialSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './control-activities-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlActivitiesSummaryComponent {
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly vm: Signal<ViewModel> = computed(() => {
    const hasReview = this.store.select(empCommonQuery.selectHasReview)();
    const isEditable = this.store.select(empCommonQuery.selectIsPeerReview)()
      ? false
      : this.store.select(requestTaskQuery.selectIsEditable)();
    const isSubTaskCompleted = hasReview
      ? this.store.select(empReviewQuery.selectIsSubtaskCompleted(CONTROL_ACTIVITIES_SUB_TASK))()
      : this.store.select(empCommonQuery.selectIsSubtaskCompleted(CONTROL_ACTIVITIES_SUB_TASK))();

    return {
      controlActivities: this.store.select(empCommonQuery.selectControlActivities)(),
      originalControlActivities: this.store.select(empVariationRegulatorQuery.selectOriginalControlActivities)(),
      variationDecisionDetails: this.store.select(
        empVariationRegulatorQuery.selectSubtaskVariationDecisionDetails(CONTROL_ACTIVITIES_SUB_TASK),
      )(),
      isVariationRegulatorDecision: this.store.select(empCommonQuery.selectIsVariationRegulator)(),
      hasReview: hasReview,
      empReviewDecisionDTO: this.store.select(
        empVariationReviewQuery.selectEmpReviewDecisionDTO(CONTROL_ACTIVITIES_SUB_TASK),
      )(),
      controlActivitiesMap: controlActivitiesMap,
      isEditable: isEditable,
      isSubTaskCompleted: isSubTaskCompleted,
      wizardStep: ControlActivitiesWizardStep,
    };
  });

  onSubmit() {
    this.service
      .submitSubtask(CONTROL_ACTIVITIES_SUB_TASK, ControlActivitiesWizardStep.SUMMARY, this.route)
      .subscribe();
  }
}

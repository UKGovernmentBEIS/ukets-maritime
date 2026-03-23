import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmpIssuanceDetermination } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { empReviewQuery, EmpReviewTaskPayload } from '@requests/common';
import {
  OVERALL_DECISION_SUB_TASK,
  overallDecisionMap,
  OverallDecisionWizardStep,
} from '@requests/common/emp/subtasks/overall-decision';
import { EmpReviewService } from '@requests/tasks/emp-review/services';
import { OverallDecisionSummaryTemplateComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  determination: EmpIssuanceDetermination;
  overallDecisionMap: SubTaskListMap<{ actions: string; question: string }>;
  isEditable: boolean;
  isSubTaskCompleted: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-overall-decision-review-summary',
  standalone: true,
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    PendingButtonDirective,
    ReturnToTaskOrActionPageComponent,
    OverallDecisionSummaryTemplateComponent,
  ],
  templateUrl: './overall-decision-review-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverallDecisionReviewSummaryComponent {
  private readonly service: TaskService<EmpReviewTaskPayload> = inject(TaskService<EmpReviewTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  vm: Signal<ViewModel> = computed(() => ({
    determination: this.store.select(empReviewQuery.selectDetermination)(),
    overallDecisionMap: overallDecisionMap,
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    isSubTaskCompleted: this.store.select(empReviewQuery.selectIsOverallDecisionCompleted)(),
    wizardStep: OverallDecisionWizardStep,
  }));

  onSubmit() {
    (this.service as EmpReviewService)
      .saveReviewDetermination(
        OVERALL_DECISION_SUB_TASK,
        OverallDecisionWizardStep.SUMMARY,
        this.route,
        this.store.select(empReviewQuery.selectDetermination)(),
      )
      .subscribe();
  }
}

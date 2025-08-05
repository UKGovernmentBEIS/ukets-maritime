import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmpVariationDetermination } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { empVariationReviewQuery } from '@requests/common/emp/+state';
import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import {
  OVERALL_DECISION_SUB_TASK,
  overallDecisionMap,
  OverallDecisionWizardStep,
} from '@requests/common/emp/subtasks/overall-decision';
import { EmpVariationReviewService } from '@requests/tasks/emp-variation-review/services';
import { OverallDecisionSummaryTemplateComponent } from '@shared/components';
import { DeterminationTypePipe } from '@shared/pipes';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  determination: EmpVariationDetermination;
  overallDecisionMap: SubTaskListMap<{ actions: string; question: string }>;
  isEditable: boolean;
  isSubTaskCompleted: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-overall-decision-variation-review-summary',
  standalone: true,
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    PendingButtonDirective,
    ReturnToTaskOrActionPageComponent,
    OverallDecisionSummaryTemplateComponent,
    DeterminationTypePipe,
  ],
  templateUrl: './overall-decision-variation-review-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverallDecisionVariationReviewSummaryComponent {
  private readonly service: TaskService<EmpVariationReviewTaskPayload> = inject(
    TaskService<EmpVariationReviewTaskPayload>,
  );
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  vm: Signal<ViewModel> = computed(() => ({
    determination: this.store.select(empVariationReviewQuery.selectDetermination)(),
    overallDecisionMap: overallDecisionMap,
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    isSubTaskCompleted: this.store.select(empVariationReviewQuery.selectIsOverallDecisionCompleted)(),
    wizardStep: OverallDecisionWizardStep,
  }));

  onSubmit() {
    (this.service as EmpVariationReviewService)
      .saveReviewDetermination(
        OVERALL_DECISION_SUB_TASK,
        OverallDecisionWizardStep.SUMMARY,
        this.route,
        this.store.select(empVariationReviewQuery.selectDetermination)(),
      )
      .subscribe();
  }
}

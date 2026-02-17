import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpDataGaps } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpReviewTaskPayload } from '@requests/common/emp/emp.types';
import { DATA_GAPS_SUB_TASK, DataGapsWizardStep } from '@requests/common/emp/subtasks/data-gaps';
import { dataGapsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  REVIEW_DECISION_FORM,
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewDecisionFormProvider,
} from '@requests/tasks/emp-review/components/review-decision';
import { EmpReviewService } from '@requests/tasks/emp-review/services';
import { DataGapsSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  dataGaps: EmpDataGaps;
  dataGapsMap: SubTaskListMap<{ dataGapsMethod: string; decision: string }>;
  isEditable: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-data-gaps-decision',
  imports: [DataGapsSummaryTemplateComponent, WizardStepComponent, ReviewDecisionComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './data-gaps-decision.component.html',
  providers: [reviewDecisionFormProvider(DATA_GAPS_SUB_TASK)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGapsDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpReviewTaskPayload> = inject(TaskService<EmpReviewTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly vm: Signal<ViewModel> = computed(() => ({
    dataGaps: this.store.select(empCommonQuery.selectDataGaps)(),
    dataGapsMap: dataGapsMap,
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    wizardStep: transformWizardStepDecision(DataGapsWizardStep),
  }));

  onSubmit() {
    (this.service as EmpReviewService)
      .saveReviewDecision(
        DATA_GAPS_SUB_TASK,
        DataGapsWizardStep.DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[DATA_GAPS_SUB_TASK],
      )
      .subscribe();
  }
}

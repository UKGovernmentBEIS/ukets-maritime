import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { TextareaComponent } from '@netz/govuk-components';

import { empReviewQuery, EmpReviewTaskPayload, TASK_FORM } from '@requests/common';
import {
  OVERALL_DECISION_SUB_TASK,
  overallDecisionMap,
  OverallDecisionWizardStep,
} from '@requests/common/emp/subtasks/overall-decision';
import { EmpReviewService } from '@requests/tasks/emp-review/services';
import { overallDecisionQuestionFormProvider } from '@requests/tasks/emp-review/subtasks/overall-decision/overall-decision-question/overall-decision-question.form-provider';
import { WizardStepComponent } from '@shared/components';
import { DeterminationHeaderTypePipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-overall-decision-question',
  standalone: true,
  imports: [WizardStepComponent, ReactiveFormsModule, TextareaComponent, DeterminationHeaderTypePipe],
  templateUrl: './overall-decision-question.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [overallDecisionQuestionFormProvider],
})
export class OverallDecisionQuestionComponent {
  protected readonly form = inject(TASK_FORM);
  protected readonly overallDecisionMap = overallDecisionMap;
  private readonly service: TaskService<EmpReviewTaskPayload> = inject(TaskService<EmpReviewTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  determinationType = this.store.select(empReviewQuery.selectDetermination)()?.type;
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  onSubmit() {
    (this.service as EmpReviewService)
      .saveReviewDetermination(
        OVERALL_DECISION_SUB_TASK,
        OverallDecisionWizardStep.OVERALL_DECISION_QUESTION,
        this.route,
        this.form.value,
      )
      .subscribe();
  }
}

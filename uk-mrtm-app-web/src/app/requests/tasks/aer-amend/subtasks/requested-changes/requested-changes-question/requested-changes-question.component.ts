import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { CheckboxComponent, CheckboxesComponent } from '@netz/govuk-components';

import { regulatorCommentsSubtaskMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { aerAmendQuery } from '@requests/tasks/aer-amend/+state';
import { AER_SUBTASK_TITLES_MAP } from '@requests/tasks/aer-amend/aer-amend.helpers';
import { AerAmendTaskPayload } from '@requests/tasks/aer-amend/aer-amend.types';
import {
  REQUESTED_CHANGES_SUB_TASK,
  RequestedChangesWizardStep,
} from '@requests/tasks/aer-amend/subtasks/requested-changes/requested-changes.helpers';
import { requestedChangesQuestionFormProvider } from '@requests/tasks/aer-amend/subtasks/requested-changes/requested-changes-question/requested-changes-question.form.provider';
import { EmpReviewReturnForAmendsSubtaskSummaryTemplateComponent, WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-aer-requested-changes-question',
  standalone: true,
  imports: [
    ReturnToTaskOrActionPageComponent,
    CheckboxComponent,
    CheckboxesComponent,
    WizardStepComponent,
    ReactiveFormsModule,
    EmpReviewReturnForAmendsSubtaskSummaryTemplateComponent,
  ],
  templateUrl: './requested-changes-question.component.html',
  providers: [requestedChangesQuestionFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestedChangesQuestionComponent {
  public readonly form = inject(TASK_FORM);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service: TaskService<AerAmendTaskPayload> = inject(TaskService<AerAmendTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  headerTitle = regulatorCommentsSubtaskMap.requestedChanges.title;
  decisionForAmends = computed(() => this.store.select(aerAmendQuery.selectReviewDecisionsForAmends)());

  subtaskTitleMap: Record<string, string> = AER_SUBTASK_TITLES_MAP;

  onSubmit() {
    this.service
      .saveSubtask(
        REQUESTED_CHANGES_SUB_TASK,
        RequestedChangesWizardStep.REQUESTED_CHANGES_AGREEMENT,
        this.route,
        this.form.value,
      )
      .subscribe();
  }
}

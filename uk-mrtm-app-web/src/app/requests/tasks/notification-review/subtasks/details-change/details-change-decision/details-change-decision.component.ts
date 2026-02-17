import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import {
  ConditionalContentDirective,
  DateInputComponent,
  RadioComponent,
  RadioOptionComponent,
  TextareaComponent,
} from '@netz/govuk-components';

import { nocReviewQuery } from '@requests/common/emp/+state/noc-review.selectors';
import { ReviewTaskPayload } from '@requests/common/emp/emp.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import {
  DETAILS_CHANGE_SUB_TASK,
  DetailsChangeWizardStep,
} from '@requests/tasks/notification-review/subtasks/details-change';
import { detailsChangeDecisionFormProvider } from '@requests/tasks/notification-review/subtasks/details-change/details-change-decision/details-change-decision.form-provider';
import { detailsChangeMap } from '@requests/tasks/notification-review/subtasks/subtask-list.map';
import {
  BooleanRadioGroupComponent,
  NotificationDetailsOfChangeSummaryTemplateComponent,
  WizardStepComponent,
} from '@shared/components';

@Component({
  selector: 'mrtm-details-change-decision',
  imports: [
    WizardStepComponent,
    ReactiveFormsModule,
    RadioComponent,
    RadioOptionComponent,
    BooleanRadioGroupComponent,
    TextareaComponent,
    DateInputComponent,
    ConditionalContentDirective,
    NotificationDetailsOfChangeSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './details-change-decision.component.html',
  providers: [detailsChangeDecisionFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsChangeDecisionComponent {
  protected readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly service: TaskService<ReviewTaskPayload> = inject(TaskService<ReviewTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  protected readonly detailsChangeMap = detailsChangeMap;
  readonly empNotification = this.store.select(nocReviewQuery.selectEmpNotification)();
  notificationFiles = this.store.select(
    nocReviewQuery.selectNotificationAttachedFiles(this.empNotification?.detailsOfChange?.documents),
  )();

  onSubmit() {
    this.service
      .saveSubtask(DETAILS_CHANGE_SUB_TASK, DetailsChangeWizardStep.REVIEW_DECISION, this.route, this.form.value)
      .subscribe();
  }
}

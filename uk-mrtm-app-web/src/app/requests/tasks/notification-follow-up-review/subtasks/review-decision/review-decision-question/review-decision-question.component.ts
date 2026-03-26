import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import {
  ButtonDirective,
  ConditionalContentDirective,
  DateInputComponent,
  FieldsetDirective,
  LegendDirective,
  RadioComponent,
  RadioOptionComponent,
  TextareaComponent,
} from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { TASK_FORM } from '@requests/common/task-form.token';
import { followUpReviewQuery } from '@requests/tasks/notification-follow-up-review/+state';
import { FollowUpReviewTaskPayload } from '@requests/tasks/notification-follow-up-review/follow-up-review.types';
import {
  REVIEW_DECISION_SUB_TASK,
  ReviewDecisionWizardStep,
} from '@requests/tasks/notification-follow-up-review/subtasks/review-decision';
import {
  createAnotherRequiredChange,
  reviewDecisionQuestionFormProvider,
} from '@requests/tasks/notification-follow-up-review/subtasks/review-decision/review-decision-question/review-decision-question.form-provider';
import { followUpReviewDecisionMap } from '@requests/tasks/notification-follow-up-review/subtasks/subtask-list.map';
import {
  FollowUpResponseRegulatorSummaryTemplateComponent,
  MultipleFileInputComponent,
  WizardStepComponent,
} from '@shared/components';
import { RequestTaskFileService } from '@shared/services';
import { FollowUpResponseDTO } from '@shared/types';

@Component({
  selector: 'mrtm-review-decision-question',
  imports: [
    WizardStepComponent,
    ReactiveFormsModule,
    RadioComponent,
    RadioOptionComponent,
    TextareaComponent,
    ConditionalContentDirective,
    FieldsetDirective,
    ButtonDirective,
    MultipleFileInputComponent,
    LegendDirective,
    DateInputComponent,
    FollowUpResponseRegulatorSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './review-decision-question.component.html',
  providers: [reviewDecisionQuestionFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewDecisionQuestionComponent {
  protected readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly service: TaskService<FollowUpReviewTaskPayload> = inject(TaskService<FollowUpReviewTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly requestTaskFileService: RequestTaskFileService = inject(RequestTaskFileService);

  protected readonly reviewDecisionMap = followUpReviewDecisionMap;
  downloadUrl = this.store.select(empCommonQuery.selectTasksDownloadUrl)();
  readonly followUpResponseDTO: Signal<FollowUpResponseDTO> = this.store.select(
    followUpReviewQuery.selectFollowUpResponseDTO,
  );
  readonly minDueDate = computed(() => {
    const auxDate = new Date(this.followUpResponseDTO().followUpResponseExpirationDate);
    return new Date(auxDate.setDate(auxDate.getDate() + 1));
  });

  get requiredChangesCtrl(): UntypedFormArray {
    return this.form.controls.requiredChanges as UntypedFormArray;
  }

  addOtherRequiredChange(): void {
    this.requiredChangesCtrl.push(
      createAnotherRequiredChange(
        this.store.select(requestTaskQuery.selectRequestTaskId)(),
        this.requestTaskFileService,
      ),
    );
  }

  onSubmit() {
    this.service
      .saveSubtask(
        REVIEW_DECISION_SUB_TASK,
        ReviewDecisionWizardStep.REVIEW_DECISION_QUESTION,
        this.route,
        this.form.value,
      )
      .subscribe();
  }
}

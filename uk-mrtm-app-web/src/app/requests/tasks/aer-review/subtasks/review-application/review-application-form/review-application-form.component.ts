import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import {
  ButtonDirective,
  ConditionalContentDirective,
  FieldsetDirective,
  LegendDirective,
  RadioComponent,
  RadioOptionComponent,
  TextareaComponent,
} from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import {
  AER_REVIEW_AVAILABLE_OPTIONS,
  AER_REVIEW_SUBTASK,
  AER_REVIEW_SUBTASK_DETAILS,
  AER_REVIEW_TASK_TITLE,
  AerReviewWizardSteps,
} from '@requests/tasks/aer-review';
import { ReviewApplicationFormGroupModel } from '@requests/tasks/aer-review/aer-review.types';
import { reviewApplicationFormProvider } from '@requests/tasks/aer-review/subtasks/review-application/review-application-form/review-application-form.provider';
import { createAnotherRequiredChange } from '@requests/tasks/emp-review/components';
import { MultipleFileInputComponent, WizardStepComponent } from '@shared/components';
import { RequestTaskFileService } from '@shared/services';

@Component({
  selector: 'mrtm-review-application-form',
  standalone: true,
  imports: [
    WizardStepComponent,
    ReactiveFormsModule,
    RadioComponent,
    RadioOptionComponent,
    TextareaComponent,
    NgComponentOutlet,
    MultipleFileInputComponent,
    ConditionalContentDirective,
    FieldsetDirective,
    ButtonDirective,
    LegendDirective,
  ],
  providers: [reviewApplicationFormProvider],
  templateUrl: './review-application-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewApplicationFormComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);
  private readonly store = inject(RequestTaskStore);
  private readonly requestTaskFileService = inject(RequestTaskFileService);

  public readonly availableOptions = inject(AER_REVIEW_AVAILABLE_OPTIONS);
  public readonly summaryDetails = inject(AER_REVIEW_SUBTASK_DETAILS, { optional: true });
  public readonly title = inject(AER_REVIEW_TASK_TITLE);
  public readonly formGroup: ReviewApplicationFormGroupModel = inject(TASK_FORM);
  public readonly subtask = inject(AER_REVIEW_SUBTASK);
  public readonly downloadUrl = this.store.select(requestTaskQuery.selectTasksDownloadUrl)();

  get requiredChangesCtrl() {
    return this.formGroup.controls.requiredChanges;
  }

  public onSubmit(): void {
    this.taskService
      .saveSubtask(this.subtask, AerReviewWizardSteps.FORM, this.activatedRoute, this.formGroup.value)
      .pipe(take(1))
      .subscribe();
  }

  addOtherRequiredChange(): void {
    this.requiredChangesCtrl.push(createAnotherRequiredChange(this.store, this.requestTaskFileService));
  }
}

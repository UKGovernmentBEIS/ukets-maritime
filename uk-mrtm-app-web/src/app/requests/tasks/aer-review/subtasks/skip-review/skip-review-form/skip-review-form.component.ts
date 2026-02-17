import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { take } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import {
  ConditionalContentDirective,
  RadioComponent,
  RadioOptionComponent,
  TextareaComponent,
} from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { AerReviewService } from '@requests/tasks/aer-review/services';
import { SkipReviewWizardSteps } from '@requests/tasks/aer-review/subtasks/skip-review';
import { provideSkipReviewForm } from '@requests/tasks/aer-review/subtasks/skip-review/skip-review-form/skip-review-form.provider';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-skip-review-form',
  imports: [
    WizardStepComponent,
    ConditionalContentDirective,
    RadioComponent,
    RadioOptionComponent,
    TextareaComponent,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './skip-review-form.component.html',
  providers: [provideSkipReviewForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkipReviewFormComponent {
  private readonly service = inject(TaskService) as AerReviewService;
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public readonly formGroup: FormGroup = inject(TASK_FORM);

  public onSubmit(): void {
    this.service
      .skipReview(this.formGroup.value)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['./', SkipReviewWizardSteps.SUCCESS], {
          relativeTo: this.activatedRoute,
          skipLocationChange: true,
        });
      });
  }
}

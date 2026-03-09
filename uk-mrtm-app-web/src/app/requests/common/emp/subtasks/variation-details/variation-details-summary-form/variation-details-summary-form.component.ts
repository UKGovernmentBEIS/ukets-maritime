import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { TextareaComponent } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { variationDetailsSubtaskMap } from '@requests/common/emp/subtasks/subtask-list.map';
import {
  VARIATION_DETAILS_SUB_TASK,
  VariationDetailsWizardStep,
} from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import { variationDetailsSummaryFormProvider } from '@requests/common/emp/subtasks/variation-details/variation-details-summary-form/variation-details-summary-form.provider';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-variation-details-summary-form',
  standalone: true,
  imports: [WizardStepComponent, TextareaComponent, ReactiveFormsModule],
  providers: [variationDetailsSummaryFormProvider],
  templateUrl: './variation-details-summary-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariationDetailsSummaryFormComponent {
  private readonly service = inject(TaskService);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly form = inject(TASK_FORM);
  readonly map = variationDetailsSubtaskMap;

  public onSubmit(): void {
    this.service
      .saveSubtask(
        VARIATION_DETAILS_SUB_TASK,
        VariationDetailsWizardStep.CHANGES_SUMMARY,
        this.activatedRoute,
        this.form.value,
      )
      .pipe(take(1))
      .subscribe();
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { TextareaComponent } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { REVIEW_REPORT_SUMMARY_SUBTASK } from '@requests/common/vir';
import { VirReviewReportSummaryWizardStep } from '@requests/tasks/vir-review/subtasks/report-summary/report-summary.helpers';
import { reportSummaryFormProvider } from '@requests/tasks/vir-review/subtasks/report-summary/report-summary-form/report-summary-form.provider';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-report-summary-form',
  imports: [WizardStepComponent, TextareaComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './report-summary-form.component.html',
  providers: [reportSummaryFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportSummaryFormComponent {
  private readonly service = inject(TaskService);
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly formGroup: FormGroup = inject(TASK_FORM);

  public onSubmit(): void {
    this.service
      .saveSubtask(
        REVIEW_REPORT_SUMMARY_SUBTASK,
        VirReviewReportSummaryWizardStep.REPORT,
        this.activatedRoute,
        this.formGroup.value,
      )
      .pipe(take(1))
      .subscribe();
  }
}

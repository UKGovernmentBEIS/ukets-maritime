import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { TaskItemStatus } from '@requests/common';
import { REVIEW_REPORT_SUMMARY_SUBTASK } from '@requests/common/vir';
import { virReviewQuery } from '@requests/tasks/vir-review/+state';
import { VirReviewReportSummaryWizardStep } from '@requests/tasks/vir-review/subtasks/report-summary/report-summary.helpers';
import { VirRespondToOperatorWizardStep } from '@requests/tasks/vir-review/subtasks/respond-to-operator/respond-to-operator.helpers';
import { VirRegulatorReportSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-report-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ButtonDirective,
    VirRegulatorReportSummaryTemplateComponent,
    PendingButtonDirective,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './report-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportSummaryComponent {
  private readonly store = inject(RequestTaskStore);
  private readonly service = inject(TaskService);
  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly wizardStepMap = VirReviewReportSummaryWizardStep;
  public readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  public readonly isSubTaskCompleted = computed(
    () => this.store.select(virReviewQuery.selectStatusForReportSummary)() === TaskItemStatus.COMPLETED,
  );

  public readonly reportSummaryData = computed(
    () => this.store.select(virReviewQuery.selectPayload)()?.regulatorReviewResponse,
  );

  public onSubmit(): void {
    this.service
      .submitSubtask(REVIEW_REPORT_SUMMARY_SUBTASK, VirRespondToOperatorWizardStep.SUMMARY, this.activatedRoute)
      .pipe(take(1))
      .subscribe();
  }
}

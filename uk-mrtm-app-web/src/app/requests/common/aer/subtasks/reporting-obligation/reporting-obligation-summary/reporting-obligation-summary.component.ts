import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { reportingObligationMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import { REPORTING_OBLIGATION_SUB_TASK } from '@requests/common/aer/subtasks/reporting-obligation';
import { ReportingObligationWizardStep } from '@requests/common/aer/subtasks/reporting-obligation/reporting-obligation.helpers';
import { ReportingObligationSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-reporting-obligation-summary',
  standalone: true,
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    PendingButtonDirective,
    ReportingObligationSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './reporting-obligation-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingObligationSummaryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TaskService<AerSubmitTaskPayload>);
  private readonly store = inject(RequestTaskStore);

  readonly subtask = REPORTING_OBLIGATION_SUB_TASK;
  readonly wizardStep = ReportingObligationWizardStep;
  readonly map = reportingObligationMap;

  readonly reportingYear = this.store.select(aerCommonQuery.selectReportingYear);
  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  readonly isSubtaskCompleted = this.store.select(
    aerCommonQuery.selectIsSubtaskCompleted(REPORTING_OBLIGATION_SUB_TASK),
  );
  readonly reportingRequired = this.store.select(aerCommonQuery.selectReportingRequired);
  readonly reportingObligationDetails = this.store.select(aerCommonQuery.selectReportingObligationDetails);
  readonly supportingDocuments = this.store.select(
    aerCommonQuery.selectAttachedFiles(this.reportingObligationDetails()?.supportingDocuments),
  );

  constructor() {
    if (this.route.snapshot.queryParams?.['change'] === 'true') {
      this.router.navigate([], { queryParams: { change: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  onSubmit(): void {
    this.service.submitSubtask(this.subtask, this.wizardStep?.SUMMARY ?? '../', this.route).subscribe();
  }
}

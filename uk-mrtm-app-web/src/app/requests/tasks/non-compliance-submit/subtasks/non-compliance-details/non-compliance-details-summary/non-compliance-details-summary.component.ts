import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import {
  NON_COMPLIANCE_DETAILS_SUB_TASK,
  NON_COMPLIANCE_SUBMIT_SUCCESS_MESSAGE_PATH,
  nonComplianceDetailsMap,
  NonComplianceDetailsStep,
  NonComplianceSubmitTaskPayload,
} from '@requests/common/non-compliance';
import { nonComplianceSubmitQuery } from '@requests/tasks/non-compliance-submit/+state';
import { NonComplianceDetailsSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-non-compliance-details-summary',
  standalone: true,
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    NonComplianceDetailsSummaryTemplateComponent,
  ],
  templateUrl: './non-compliance-details-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceDetailsSummaryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TaskService<NonComplianceSubmitTaskPayload>);
  private readonly store = inject(RequestTaskStore);

  readonly map = nonComplianceDetailsMap;

  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  readonly isSubtaskCompleted = this.store.select(nonComplianceSubmitQuery.selectIsDetailsSubtaskCompleted);
  readonly nonComplianceDetailsSummary = this.store.select(nonComplianceSubmitQuery.selectNonComplianceDetailsSummary);

  constructor() {
    if (this.route.snapshot.queryParams?.['change'] === 'true') {
      this.router.navigate([], { queryParams: { change: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  onSubmit(): void {
    this.service
      .submitSubtask(NON_COMPLIANCE_DETAILS_SUB_TASK, NonComplianceDetailsStep.SUMMARY, this.route)
      .subscribe(() => {
        this.service.submit().subscribe(() => {
          this.router.navigate([NON_COMPLIANCE_SUBMIT_SUCCESS_MESSAGE_PATH], { relativeTo: this.route });
        });
      });
  }
}

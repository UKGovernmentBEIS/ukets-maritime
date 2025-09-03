import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import {
  NON_COMPLIANCE_FINAL_DETERMINATION_DETAILS_SUB_TASK,
  NON_COMPLIANCE_FINAL_DETERMINATION_SUCCESS_MESSAGE_PATH,
  nonComplianceFinalDeterminationDetailsMap,
  NonComplianceFinalDeterminationDetailsStep,
  NonComplianceFinalDeterminationTaskPayload,
} from '@requests/common/non-compliance';
import { nonComplianceFinalDeterminationQuery } from '@requests/tasks/non-compliance-final-determination/+state';
import { NonComplianceFinalDeterminationDetailsSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-non-compliance-final-determination-details-summary',
  standalone: true,
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    NonComplianceFinalDeterminationDetailsSummaryTemplateComponent,
  ],
  templateUrl: './non-compliance-final-determination-details-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceFinalDeterminationDetailsSummaryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TaskService<NonComplianceFinalDeterminationTaskPayload>);
  private readonly store = inject(RequestTaskStore);

  readonly map = nonComplianceFinalDeterminationDetailsMap;

  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  readonly isSubtaskCompleted = this.store.select(nonComplianceFinalDeterminationQuery.selectIsDetailsSubtaskCompleted);
  readonly nonComplianceFinalDetermination = this.store.select(
    nonComplianceFinalDeterminationQuery.selectNonComplianceFinalDetermination,
  );

  constructor() {
    if (this.route.snapshot.queryParams?.['change'] === 'true') {
      this.router.navigate([], { queryParams: { change: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  onSubmit(): void {
    this.service
      .submitSubtask(
        NON_COMPLIANCE_FINAL_DETERMINATION_DETAILS_SUB_TASK,
        NonComplianceFinalDeterminationDetailsStep.SUMMARY,
        this.route,
      )
      .subscribe(() => {
        this.service.submit().subscribe(() => {
          this.router.navigate([NON_COMPLIANCE_FINAL_DETERMINATION_SUCCESS_MESSAGE_PATH], { relativeTo: this.route });
        });
      });
  }
}

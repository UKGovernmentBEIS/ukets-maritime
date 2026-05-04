import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NonComplianceCivilPenaltyRequestTaskPayload } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import {
  NON_COMPLIANCE_CIVIL_PENALTY_UPLOAD_SUB_TASK,
  nonComplianceCivilPenaltyMap,
  NonComplianceCivilPenaltyUploadStep,
} from '@requests/common/non-compliance';
import { nonComplianceCommonQuery } from '@requests/common/non-compliance/+state';
import { nonComplianceCivilPenaltyCommonQuery } from '@requests/common/non-compliance/non-compliance-civil-penalty/+state';
import { NonComplianceCivilPenaltyUploadSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-non-compliance-civil-penalty-upload-summary',
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    NonComplianceCivilPenaltyUploadSummaryTemplateComponent,
    PendingButtonDirective,
  ],
  standalone: true,
  templateUrl: './non-compliance-civil-penalty-upload-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceCivilPenaltyUploadSummaryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TaskService<NonComplianceCivilPenaltyRequestTaskPayload>);
  private readonly store = inject(RequestTaskStore);

  readonly map = nonComplianceCivilPenaltyMap;
  readonly isEditable = this.store.select(nonComplianceCivilPenaltyCommonQuery.selectIsFormEditable);
  readonly isSubtaskCompleted = this.store.select(nonComplianceCivilPenaltyCommonQuery.selectIsUploadSubtaskCompleted);
  readonly nonComplianceCivilPenaltyUpload = this.store.select(
    nonComplianceCivilPenaltyCommonQuery.selectNonComplianceCivilPenaltyUpload,
  );

  private readonly civilPenalty = computed(() => this.nonComplianceCivilPenaltyUpload()?.civilPenalty);
  readonly files = computed(() =>
    this.civilPenalty() ? this.store.select(nonComplianceCommonQuery.selectAttachedFiles([this.civilPenalty()]))() : [],
  );

  constructor() {
    if (this.route.snapshot.queryParams?.['change'] === 'true') {
      this.router.navigate([], { queryParams: { change: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  onSubmit(): void {
    this.service
      .submitSubtask(
        NON_COMPLIANCE_CIVIL_PENALTY_UPLOAD_SUB_TASK,
        NonComplianceCivilPenaltyUploadStep.SUMMARY,
        this.route,
      )
      .subscribe();
  }
}

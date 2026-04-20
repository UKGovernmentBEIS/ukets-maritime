import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NonComplianceInitialPenaltyNoticeRequestTaskPayload } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import {
  NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_UPLOAD_SUB_TASK,
  nonComplianceInitialPenaltyNoticeMap,
  NonComplianceInitialPenaltyNoticeUploadStep,
} from '@requests/common/non-compliance';
import { nonComplianceCommonQuery } from '@requests/common/non-compliance/+state';
import { nonComplianceInitialPenaltyNoticeCommonQuery } from '@requests/common/non-compliance/non-compliance-initial-penalty-notice/+state';
import { NonComplianceInitialPenaltyNoticeUploadSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-non-compliance-initial-penalty-notice-upload-summary',
  standalone: true,
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    NonComplianceInitialPenaltyNoticeUploadSummaryTemplateComponent,
  ],
  templateUrl: './non-compliance-initial-penalty-notice-upload-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceInitialPenaltyNoticeUploadSummaryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TaskService<NonComplianceInitialPenaltyNoticeRequestTaskPayload>);
  private readonly store = inject(RequestTaskStore);

  readonly map = nonComplianceInitialPenaltyNoticeMap;
  readonly isEditable = this.store.select(nonComplianceInitialPenaltyNoticeCommonQuery.selectIsFormEditable);
  readonly isSubtaskCompleted = this.store.select(
    nonComplianceInitialPenaltyNoticeCommonQuery.selectIsUploadSubtaskCompleted,
  );
  readonly nonComplianceInitialPenaltyNoticeUpload = this.store.select(
    nonComplianceInitialPenaltyNoticeCommonQuery.selectNonComplianceInitialPenaltyNoticeUpload,
  );

  private readonly initialPenaltyNotice = computed(
    () => this.nonComplianceInitialPenaltyNoticeUpload()?.initialPenaltyNotice,
  );
  readonly files = computed(() =>
    this.initialPenaltyNotice()
      ? this.store.select(nonComplianceCommonQuery.selectAttachedFiles([this.initialPenaltyNotice()]))()
      : [],
  );

  constructor() {
    if (this.route.snapshot.queryParams?.['change'] === 'true') {
      this.router.navigate([], { queryParams: { change: null }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  onSubmit(): void {
    this.service
      .submitSubtask(
        NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_UPLOAD_SUB_TASK,
        NonComplianceInitialPenaltyNoticeUploadStep.SUMMARY,
        this.route,
      )
      .subscribe();
  }
}

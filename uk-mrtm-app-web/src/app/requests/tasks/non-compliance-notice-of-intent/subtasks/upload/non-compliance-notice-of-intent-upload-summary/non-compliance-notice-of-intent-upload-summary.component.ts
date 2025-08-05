import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NonComplianceNoticeOfIntentRequestTaskPayload } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import {
  NON_COMPLIANCE_NOTICE_OF_INTENT_UPLOAD_SUB_TASK,
  nonComplianceNoticeOfIntentMap,
  NonComplianceNoticeOfIntentUploadStep,
} from '@requests/common/non-compliance';
import { nonComplianceNoticeOfIntentCommonQuery } from '@requests/common/non-compliance/non-compliance-notice-of-intent/+state';
import { NonComplianceNoticeOfIntentUploadSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-non-compliance-notice-of-intent-upload-summary',
  standalone: true,
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    NonComplianceNoticeOfIntentUploadSummaryTemplateComponent,
  ],
  templateUrl: './non-compliance-notice-of-intent-upload-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceNoticeOfIntentUploadSummaryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TaskService<NonComplianceNoticeOfIntentRequestTaskPayload>);
  private readonly store = inject(RequestTaskStore);

  readonly map = nonComplianceNoticeOfIntentMap;
  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  readonly isSubtaskCompleted = this.store.select(
    nonComplianceNoticeOfIntentCommonQuery.selectIsUploadSubtaskCompleted,
  );
  readonly nonComplianceNoticeOfIntentUpload = this.store.select(
    nonComplianceNoticeOfIntentCommonQuery.selectNonComplianceNoticeOfIntentUpload,
  );

  private readonly noticeOfIntent = computed(() => this.nonComplianceNoticeOfIntentUpload()?.noticeOfIntent);
  readonly files = computed(() =>
    this.noticeOfIntent()
      ? this.store.select(nonComplianceNoticeOfIntentCommonQuery.selectAttachedFiles([this.noticeOfIntent()]))()
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
        NON_COMPLIANCE_NOTICE_OF_INTENT_UPLOAD_SUB_TASK,
        NonComplianceNoticeOfIntentUploadStep.SUMMARY,
        this.route,
      )
      .subscribe();
  }
}

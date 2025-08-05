import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { nonComplianceNoticeOfIntentMap } from '@requests/common/non-compliance';
import { nonComplianceNoticeOfIntentCommonQuery } from '@requests/common/non-compliance/non-compliance-notice-of-intent/+state';
import { NonComplianceNoticeOfIntentUploadSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-non-compliance-notice-of-intent-upload-summary-review',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    NonComplianceNoticeOfIntentUploadSummaryTemplateComponent,
  ],
  templateUrl: './non-compliance-notice-of-intent-upload-summary-review.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceNoticeOfIntentUploadSummaryReviewComponent {
  private readonly store = inject(RequestTaskStore);

  readonly map = nonComplianceNoticeOfIntentMap;
  readonly nonComplianceNoticeOfIntentUpload = this.store.select(
    nonComplianceNoticeOfIntentCommonQuery.selectNonComplianceNoticeOfIntentUpload,
  );
  readonly files = computed(() =>
    this.store.select(
      nonComplianceNoticeOfIntentCommonQuery.selectAttachedFiles([
        this.nonComplianceNoticeOfIntentUpload()?.noticeOfIntent,
      ]),
    )(),
  );
}

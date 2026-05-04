import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { nonComplianceInitialPenaltyNoticeMap } from '@requests/common/non-compliance';
import { nonComplianceCommonQuery } from '@requests/common/non-compliance/+state';
import { nonComplianceInitialPenaltyNoticeCommonQuery } from '@requests/common/non-compliance/non-compliance-initial-penalty-notice/+state';
import { NonComplianceInitialPenaltyNoticeUploadSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-non-compliance-initial-penalty-notice-upload-summary-review',
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    NonComplianceInitialPenaltyNoticeUploadSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './non-compliance-initial-penalty-notice-upload-summary-review.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceInitialPenaltyNoticeUploadSummaryReviewComponent {
  private readonly store = inject(RequestTaskStore);

  readonly map = nonComplianceInitialPenaltyNoticeMap;
  readonly nonComplianceInitialPenaltyNoticeUpload = this.store.select(
    nonComplianceInitialPenaltyNoticeCommonQuery.selectNonComplianceInitialPenaltyNoticeUpload,
  );
  readonly files = computed(() =>
    this.store.select(
      nonComplianceCommonQuery.selectAttachedFiles([
        this.nonComplianceInitialPenaltyNoticeUpload()?.initialPenaltyNotice,
      ]),
    )(),
  );
}

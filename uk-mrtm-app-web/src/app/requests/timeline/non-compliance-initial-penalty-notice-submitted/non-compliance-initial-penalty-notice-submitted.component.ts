import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { nonComplianceInitialPenaltyNoticeSubmittedQuery } from '@requests/timeline/non-compliance-initial-penalty-notice-submitted/+state';
import { NonComplianceInitialPenaltyNoticeUploadSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-non-compliance-initial-penalty-notice-submitted',
  standalone: true,
  imports: [NonComplianceInitialPenaltyNoticeUploadSummaryTemplateComponent],
  template: `
    <mrtm-non-compliance-initial-penalty-notice-upload-summary-template [data]="data()" [files]="files()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceInitialPenaltyNoticeSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly data = this.store.select(
    nonComplianceInitialPenaltyNoticeSubmittedQuery.selectNonComplianceInitialPenaltyNoticeUpload,
  );
  readonly files = computed(() =>
    this.store.select(
      nonComplianceInitialPenaltyNoticeSubmittedQuery.selectAttachedFiles([this.data()?.initialPenaltyNotice]),
    )(),
  );
}

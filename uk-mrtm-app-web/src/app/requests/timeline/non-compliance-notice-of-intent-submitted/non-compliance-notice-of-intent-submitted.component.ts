import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { nonComplianceNoticeOfIntentSubmittedQuery } from '@requests/timeline/non-compliance-notice-of-intent-submitted/+state';
import { NonComplianceNoticeOfIntentUploadSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-non-compliance-notice-of-intent-submitted',
  standalone: true,
  imports: [NonComplianceNoticeOfIntentUploadSummaryTemplateComponent],
  template: `
    <mrtm-non-compliance-notice-of-intent-upload-summary-template [data]="data()" [files]="files()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceNoticeOfIntentSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly data = this.store.select(nonComplianceNoticeOfIntentSubmittedQuery.selectNonComplianceNoticeOfIntentUpload);
  readonly files = computed(() =>
    this.store.select(nonComplianceNoticeOfIntentSubmittedQuery.selectAttachedFiles([this.data()?.noticeOfIntent]))(),
  );
}

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { nonComplianceCivilPenaltySubmittedQuery } from '@requests/timeline/non-compliance-civil-penalty-submitted/+state';
import {
  NonComplianceCivilPenaltyUploadSummaryTemplateComponent,
  NonComplianceNotifiedUsersSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-non-compliance-civil-penalty-submitted',
  imports: [
    NonComplianceCivilPenaltyUploadSummaryTemplateComponent,
    NonComplianceNotifiedUsersSummaryTemplateComponent,
  ],
  standalone: true,
  template: `
    <h2 class="govuk-heading-m">Details</h2>
    <mrtm-non-compliance-civil-penalty-upload-summary-template [data]="data()" [files]="files()" [isTimeline]="true" />
    <mrtm-non-compliance-notified-users-summary-template [notifiedUsersInfo]="notifiedUsersInfo()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceCivilPenaltySubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly data = this.store.select(nonComplianceCivilPenaltySubmittedQuery.selectNonComplianceCivilPenaltyUpload);
  readonly files = computed(() =>
    this.store.select(nonComplianceCivilPenaltySubmittedQuery.selectAttachedFiles([this.data()?.civilPenalty]))(),
  );
  readonly notifiedUsersInfo = this.store.select(nonComplianceCivilPenaltySubmittedQuery.selectNotifiedUsersInfo);
}

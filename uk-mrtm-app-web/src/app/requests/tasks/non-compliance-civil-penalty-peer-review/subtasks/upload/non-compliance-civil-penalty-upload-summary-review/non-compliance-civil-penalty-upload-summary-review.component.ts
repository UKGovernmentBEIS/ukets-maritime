import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { nonComplianceCivilPenaltyMap } from '@requests/common/non-compliance';
import { nonComplianceCommonQuery } from '@requests/common/non-compliance/+state';
import { nonComplianceCivilPenaltyCommonQuery } from '@requests/common/non-compliance/non-compliance-civil-penalty/+state';
import { NonComplianceCivilPenaltyUploadSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-non-compliance-civil-penalty-upload-summary-review',
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    NonComplianceCivilPenaltyUploadSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './non-compliance-civil-penalty-upload-summary-review.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonComplianceCivilPenaltyUploadSummaryReviewComponent {
  private readonly store = inject(RequestTaskStore);

  readonly map = nonComplianceCivilPenaltyMap;
  readonly nonComplianceCivilPenaltyUpload = this.store.select(
    nonComplianceCivilPenaltyCommonQuery.selectNonComplianceCivilPenaltyUpload,
  );
  readonly files = computed(() =>
    this.store.select(
      nonComplianceCommonQuery.selectAttachedFiles([this.nonComplianceCivilPenaltyUpload()?.civilPenalty]),
    )(),
  );
}

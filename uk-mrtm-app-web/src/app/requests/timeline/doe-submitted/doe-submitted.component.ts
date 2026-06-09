import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { doeTotalMaritimeEmissionsMap, maritimeEmissionsMap } from '@requests/common/doe';
import { doeSubmittedQuery } from '@requests/timeline/doe-submitted/+state';
import { DoeMaritimeEmissionsSummaryTemplateComponent } from '@shared/components/summaries';
import { RecipientsPartialSummaryTemplateComponent } from '@shared/components/summaries/recipients-partial-summary-template';

@Component({
  selector: 'mrtm-doe-submitted',
  imports: [DoeMaritimeEmissionsSummaryTemplateComponent, RecipientsPartialSummaryTemplateComponent],
  standalone: true,
  templateUrl: './doe-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoeSubmittedComponent {
  private readonly actionStore = inject(RequestActionStore);

  readonly officialNoticeInfo = this.actionStore.select(doeSubmittedQuery.selectOfficialNoticeInfo)();
  readonly maritimeEmissionsMap = maritimeEmissionsMap;
  readonly doeTotalMaritimeEmissionsMap = doeTotalMaritimeEmissionsMap;
  readonly maritimeEmissions = this.actionStore.select(doeSubmittedQuery.selectMaritimeEmissions);
  readonly files = computed(() => {
    const maritimeEmissions = this.maritimeEmissions();
    return this.actionStore.select(
      doeSubmittedQuery.selectAttachedFiles(maritimeEmissions?.totalMaritimeEmissions?.supportingDocuments),
    )();
  });
}

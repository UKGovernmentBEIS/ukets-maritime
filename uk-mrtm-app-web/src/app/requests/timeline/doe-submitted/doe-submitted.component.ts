import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ITEM_TYPE_TO_RETURN_TEXT_MAPPER, RequestActionStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import { doeTotalMaritimeEmissionsMap, maritimeEmissionsMap } from '@requests/common/doe';
import { timelineCommonQuery } from '@requests/common/timeline';
import { doeSubmittedQuery } from '@requests/timeline/doe-submitted/+state';
import { DoeMaritimeEmissionsSummaryTemplateComponent } from '@shared/components/summaries';
import { RecipientsPartialSummaryTemplateComponent } from '@shared/components/summaries/recipients-partial-summary-template';

@Component({
  selector: 'mrtm-doe-submitted',
  standalone: true,
  imports: [
    LinkDirective,
    RouterLink,
    DoeMaritimeEmissionsSummaryTemplateComponent,
    RecipientsPartialSummaryTemplateComponent,
  ],
  templateUrl: './doe-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoeSubmittedComponent {
  private readonly actionStore = inject(RequestActionStore);
  private readonly typeToText = inject(ITEM_TYPE_TO_RETURN_TEXT_MAPPER);

  readonly returnToText = computed(() => {
    const year = this.actionStore.select(timelineCommonQuery.selectReportingYear)();
    return this.typeToText('DOE_APPLICATION_SUBMIT', year);
  });

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

import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import { aerVoyagesMap } from '@requests/common/aer/subtasks/aer-voyages';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import { VoyageSummaryTemplateComponent } from '@shared/components/summaries/ports-and-voyages/voyage-summary-template/voyage-summary-template.component';

@Component({
  selector: 'mrtm-aer-voyage-submitted',
  imports: [VoyageSummaryTemplateComponent, RouterLink, LinkDirective, PageHeadingComponent],
  standalone: true,
  templateUrl: './aer-voyage-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerVoyageSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly map = aerVoyagesMap;
  readonly voyageId = input<string>();
  readonly voyage = computed(() => this.store.select(aerTimelineCommonQuery.selectVoyage(this.voyageId()))());
  readonly ship = computed(() =>
    this.store.select(aerTimelineCommonQuery.selectRelatedShipForVoyage(this.voyageId()))(),
  );
}

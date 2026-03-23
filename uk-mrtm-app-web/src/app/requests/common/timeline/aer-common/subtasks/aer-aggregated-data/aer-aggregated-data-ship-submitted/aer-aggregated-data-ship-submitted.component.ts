import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AerShipAggregatedData, AerShipEmissions } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import { aerAggregatedDataSubtasksListMap } from '@requests/common/aer/subtasks/aer-aggregated-data';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import { AerAggregatedDataShipSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-aer-aggregated-data-ship-submitted',
  standalone: true,
  imports: [PageHeadingComponent, RouterLink, LinkDirective, AerAggregatedDataShipSummaryTemplateComponent],
  templateUrl: './aer-aggregated-data-ship-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataShipSubmittedComponent {
  private readonly store = inject(RequestActionStore);

  readonly dataId = input<string>();
  readonly aggregatedData: Signal<AerShipAggregatedData> = computed(() =>
    this.store.select(aerTimelineCommonQuery.selectAggregatedDataItem(this.dataId()))(),
  );
  readonly ship: Signal<AerShipEmissions> = computed(() =>
    this.store.select(aerTimelineCommonQuery.selectRelatedShipForAggregatedData(this.dataId()))(),
  );
  readonly map = aerAggregatedDataSubtasksListMap;
}

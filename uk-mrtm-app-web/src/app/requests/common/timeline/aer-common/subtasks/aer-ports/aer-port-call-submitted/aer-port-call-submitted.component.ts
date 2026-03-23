import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AerShipEmissions } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import { aerPortsMap } from '@requests/common/aer/subtasks/aer-ports';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import { PortCallSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-aer-port-call-submitted',
  standalone: true,
  imports: [PageHeadingComponent, RouterLink, LinkDirective, PortCallSummaryTemplateComponent],
  templateUrl: './aer-port-call-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerPortCallSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly map = aerPortsMap;
  readonly portId = input<string>();
  readonly port = computed(() => this.store.select(aerTimelineCommonQuery.selectPort(this.portId()))());
  readonly ship: Signal<AerShipEmissions> = computed(() =>
    this.store.select(aerTimelineCommonQuery.selectRelatedShipForPort(this.portId()))(),
  );
}

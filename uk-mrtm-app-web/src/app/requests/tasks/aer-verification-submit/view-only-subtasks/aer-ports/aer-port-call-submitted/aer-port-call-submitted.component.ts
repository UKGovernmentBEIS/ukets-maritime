import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AerShipEmissions } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { aerPortsMap } from '@requests/common/aer/subtasks/aer-ports';
import { PortCallSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-aer-port-call-submitted',
  standalone: true,
  imports: [PageHeadingComponent, RouterLink, LinkDirective, PortCallSummaryTemplateComponent],
  templateUrl: './aer-port-call-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerPortCallSubmittedComponent {
  private readonly store = inject(RequestTaskStore);
  readonly map = aerPortsMap;
  readonly portId = input<string>();
  readonly port = computed(() => this.store.select(aerCommonQuery.selectPort(this.portId()))());
  readonly ship: Signal<AerShipEmissions> = computed(() =>
    this.store.select(aerCommonQuery.selectRelatedShipForPort(this.portId()))(),
  );
}

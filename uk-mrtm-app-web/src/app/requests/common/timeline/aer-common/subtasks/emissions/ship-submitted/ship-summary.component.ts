import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { ReturnToShipsListTableComponent } from '@requests/common/components/emissions/return-to-ships-list-table';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import { AerShipSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-ship-submitted',
  standalone: true,
  imports: [AerShipSummaryTemplateComponent, ReturnToShipsListTableComponent, PageHeadingComponent],
  templateUrl: './ship-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipSummaryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(RequestActionStore);
  private readonly shipId = this.route.snapshot.params['shipId'];

  readonly ship = this.store.select(aerTimelineCommonQuery.selectShip(this.shipId));
}

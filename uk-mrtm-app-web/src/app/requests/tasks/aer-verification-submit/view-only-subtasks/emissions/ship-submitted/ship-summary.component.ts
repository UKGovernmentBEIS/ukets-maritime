import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { ReturnToShipsListTableComponent } from '@requests/common/components/emissions/return-to-ships-list-table';
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
  private readonly store = inject(RequestTaskStore);
  private readonly shipId = this.route.snapshot.params['shipId'];

  readonly ship = this.store.select(aerCommonQuery.selectShip(this.shipId));
}

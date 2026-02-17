import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { ReturnToShipsListTableComponent } from '@requests/common/components/emissions/return-to-ships-list-table';
import { EMP_SHIP_SUMMARY_CHANGE_LINKS_MAP } from '@requests/common/emp/subtasks/emissions/ship-summary/ship-summary.consts';
import { empSubmittedQuery } from '@requests/timeline/emp-submitted/+state';
import { ShipSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-ship-submitted',
  imports: [ShipSummaryTemplateComponent, ReturnToShipsListTableComponent, PageHeadingComponent],
  standalone: true,
  templateUrl: './ship-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipSummaryComponent {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: RequestActionStore = inject(RequestActionStore);

  readonly changeLinks = EMP_SHIP_SUMMARY_CHANGE_LINKS_MAP;

  private readonly shipId: string = this.route.snapshot.params['shipId'];
  readonly data = this.store.select(empSubmittedQuery.selectShip(this.shipId));
}

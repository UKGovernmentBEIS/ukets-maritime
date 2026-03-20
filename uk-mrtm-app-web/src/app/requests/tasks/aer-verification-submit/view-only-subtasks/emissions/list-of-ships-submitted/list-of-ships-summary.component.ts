import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { ListOfShipsSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-list-of-ships-submitted',
  imports: [PageHeadingComponent, ListOfShipsSummaryTemplateComponent, ReturnToTaskOrActionPageComponent],
  standalone: true,
  templateUrl: './list-of-ships-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfShipsSummaryComponent {
  private readonly store = inject(RequestTaskStore);
  readonly ships = this.store.select(aerCommonQuery.selectListOfShips);
}

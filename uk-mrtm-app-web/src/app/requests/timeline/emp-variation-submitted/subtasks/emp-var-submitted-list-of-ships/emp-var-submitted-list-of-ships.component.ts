import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { ListOfShipsSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-emp-var-submitted-list-of-ships',
  standalone: true,
  imports: [PageHeadingComponent, ListOfShipsSummaryTemplateComponent, ReturnToTaskOrActionPageComponent],
  templateUrl: './emp-var-submitted-list-of-ships.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedListOfShipsComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  public readonly ships = this.store.select(empVariationSubmittedQuery.selectListOfShips)();
}

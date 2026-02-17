import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { empSubmittedQuery } from '@requests/timeline/emp-submitted/+state';
import {
  ListOfShipsSummaryTemplateComponent,
  ReviewDecisionSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-list-of-ships-submitted',
  imports: [
    PageHeadingComponent,
    ListOfShipsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './list-of-ships-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfShipsSummaryComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);
  public readonly ships = this.store.select(empSubmittedQuery.selectListOfShips)();
  public readonly reviewGroupDecision = this.store.select(empSubmittedQuery.selectReviewGroupDecision('abbreviations'));
}

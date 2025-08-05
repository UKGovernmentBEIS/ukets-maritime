import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import {
  EmpReviewDecisionSummaryTemplateComponent,
  ListOfShipsSummaryTemplateComponent,
} from '@shared/components/summaries';

@Component({
  selector: 'mrtm-list-of-ships-submitted',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ListOfShipsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './list-of-ships-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListOfShipsSummaryComponent {
  private readonly store = inject(RequestActionStore);
  readonly ships = this.store.select(aerTimelineCommonQuery.selectListOfShips);

  readonly withReviewDecision = this.store.select(aerTimelineCommonQuery.withReviewDetermination);
  readonly decision = this.store.select(aerTimelineCommonQuery.selectSummaryReviewGroupDecision('LIST_OF_SHIPS'));
}

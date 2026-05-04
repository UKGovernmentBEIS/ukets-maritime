import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { aerVoyagesMap } from '@requests/common/aer/subtasks/aer-voyages';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import { ReviewDecisionSummaryTemplateComponent, VoyagesListSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-aer-list-of-voyages-submitted',
  imports: [
    VoyagesListSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    PageHeadingComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './aer-list-of-voyages-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerListOfVoyagesSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly map = aerVoyagesMap;
  readonly voyages = this.store.select(aerTimelineCommonQuery.selectVoyagesList);

  readonly isReviewCompletedActionType = this.store.select(aerTimelineCommonQuery.isReviewCompletedActionType);
  readonly decision = this.store.select(aerTimelineCommonQuery.selectSummaryReviewGroupDecision('VOYAGES'));
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { aerPortsMap } from '@requests/common/aer/subtasks/aer-ports';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import { PortCallsListSummaryTemplateComponent, ReviewDecisionSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-aer-list-of-port-calls-submitted',
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    PortCallsListSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './aer-list-of-port-calls-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerListOfPortCallsSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly ports = this.store.select(aerTimelineCommonQuery.selectPortsList);
  readonly map = aerPortsMap;

  readonly isReviewCompletedActionType = this.store.select(aerTimelineCommonQuery.isReviewCompletedActionType);
  readonly decision = this.store.select(aerTimelineCommonQuery.selectSummaryReviewGroupDecision('PORTS'));
}

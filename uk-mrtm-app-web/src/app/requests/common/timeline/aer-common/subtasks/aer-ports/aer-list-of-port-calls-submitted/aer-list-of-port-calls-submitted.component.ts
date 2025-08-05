import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { aerPortsMap } from '@requests/common/aer/subtasks/aer-ports';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import { EmpReviewDecisionSummaryTemplateComponent, PortCallsListSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-aer-list-of-port-calls-submitted',
  standalone: true,
  imports: [
    PageHeadingComponent,
    ReturnToTaskOrActionPageComponent,
    PortCallsListSummaryTemplateComponent,
    EmpReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './aer-list-of-port-calls-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerListOfPortCallsSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  readonly ports = this.store.select(aerTimelineCommonQuery.selectPortsList);
  readonly map = aerPortsMap;

  readonly withReviewDecision = this.store.select(aerTimelineCommonQuery.withReviewDetermination);
  readonly decision = this.store.select(aerTimelineCommonQuery.selectSummaryReviewGroupDecision('PORTS'));
}

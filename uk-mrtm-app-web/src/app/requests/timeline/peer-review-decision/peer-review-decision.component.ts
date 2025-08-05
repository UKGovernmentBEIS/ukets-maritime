import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { peerReviewDecisionQuery } from '@requests/timeline/peer-review-decision/+state/peer-review-decision.selectors';
import { getPeerReviewDecisionTimelineTextMap } from '@requests/timeline/peer-review-decision/peer-review-decision-map';
import { PeerReviewDecisionSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-peer-review-decision',
  standalone: true,
  imports: [PeerReviewDecisionSummaryTemplateComponent],
  templateUrl: './peer-review-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeerReviewDecisionComponent {
  private readonly store = inject(RequestActionStore);
  private readonly actionType = this.store.select(requestActionQuery.selectActionType);

  readonly map = computed(() => getPeerReviewDecisionTimelineTextMap(this.actionType()));
  readonly decision = this.store.select(peerReviewDecisionQuery.selectDecision);
  readonly peerReviewer = this.store.select(peerReviewDecisionQuery.selectPeerReviewer);
}

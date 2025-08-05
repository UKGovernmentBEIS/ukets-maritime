import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { PeerReviewDecisionComponent } from '@requests/timeline/peer-review-decision/peer-review-decision.component';
import { getPeerReviewDecisionTimelineTextMap } from '@requests/timeline/peer-review-decision/peer-review-decision-map';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const peerReviewDecisionTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();
  const submitter = store.select(requestActionQuery.selectSubmitter)();
  const map = getPeerReviewDecisionTimelineTextMap(actionType);

  return {
    header: `${taskActionTypeToTitleTransformer(actionType)} by ${submitter}`,
    caption: map.caption,
    component: PeerReviewDecisionComponent,
    sections: [],
  };
};

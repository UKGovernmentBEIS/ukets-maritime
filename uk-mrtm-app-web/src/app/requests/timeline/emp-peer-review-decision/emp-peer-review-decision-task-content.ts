import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { EmpPeerReviewDecisionComponent } from '@requests/timeline/emp-peer-review-decision/emp-peer-review-decision.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const empPeerReviewDecisionTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();

  return {
    header: taskActionTypeToTitleMap[actionType],
    component: EmpPeerReviewDecisionComponent,
  };
};

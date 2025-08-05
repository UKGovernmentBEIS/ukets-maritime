import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { RequestTaskStore } from '@netz/common/store';

import { WaitForPeerReviewComponent } from '@requests/common/components';
import { waitForPeerReviewQuery } from '@requests/tasks/notification-wait-for-peer-review/+state/wait-for-peer-review.selectors';
import { waitForPeerReviewMap } from '@requests/tasks/notification-wait-for-peer-review/subtask-list.map';
import { DETAILS_CHANGE_SUB_TASK } from '@requests/tasks/notification-wait-for-peer-review/subtasks/wait-for-peer-review-summary';

const routePrefix = 'wait-for-peer-review';

export const waitForPeerReviewTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);

  return {
    header: waitForPeerReviewMap.title,
    preContentComponent: WaitForPeerReviewComponent,
    sections: [
      {
        tasks: [
          {
            name: DETAILS_CHANGE_SUB_TASK,
            status: store.select(waitForPeerReviewQuery.selectDecisionType)(),
            linkText: waitForPeerReviewMap.detailsOfChange.title,
            link: `${routePrefix}/details-change`,
          },
        ],
      },
    ],
  };
};

import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { peerReviewQuery } from '@requests/tasks/notification-peer-review/+state';
import { PeerReviewActionButtonsComponent } from '@requests/tasks/notification-peer-review/components/peer-review-action-buttons';
import { DETAILS_CHANGE_SUB_TASK } from '@requests/tasks/notification-peer-review/subtasks/details-change';
import { taskActionTypeToTitleMap } from '@shared/constants';

const routePrefix = 'peer-review';

export const peerReviewTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: taskActionTypeToTitleMap?.[requestTaskType],
    preContentComponent: PeerReviewActionButtonsComponent,
    sections: [
      {
        tasks: [
          {
            name: DETAILS_CHANGE_SUB_TASK,
            status: store.select(peerReviewQuery.selectStatusForSubtask())(),
            linkText: 'Details of the change',
            link: `${routePrefix}/details-change`,
          },
        ],
      },
    ],
  };
};

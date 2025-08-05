import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { followUpReviewQuery } from '@requests/tasks/notification-follow-up-review/+state';
import { FollowUpReviewActionButtonsComponent } from '@requests/tasks/notification-follow-up-review/components';
import { REVIEW_DECISION_SUB_TASK } from '@requests/tasks/notification-follow-up-review/subtasks/review-decision';
import { taskActionTypeToTitleMap } from '@shared/constants';

const routePrefix = 'follow-up-review';

export const followUpReviewTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: taskActionTypeToTitleMap?.[requestTaskType],
    preContentComponent: FollowUpReviewActionButtonsComponent,
    sections: [
      {
        tasks: [
          {
            name: REVIEW_DECISION_SUB_TASK,
            status: store.select(followUpReviewQuery.selectStatusForSubtask(REVIEW_DECISION_SUB_TASK))(),
            linkText: 'Operator follow-up response',
            link: `${routePrefix}/review-decision`,
          },
        ],
      },
    ],
  };
};

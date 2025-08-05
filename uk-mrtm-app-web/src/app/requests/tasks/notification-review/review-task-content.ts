import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { nocReviewQuery } from '@requests/common/emp/+state/noc-review.selectors';
import { ReviewActionButtonsComponent } from '@requests/tasks/notification-review/components';
import { DETAILS_CHANGE_SUB_TASK } from '@requests/tasks/notification-review/subtasks/details-change';
import { taskActionTypeToTitleMap } from '@shared/constants';

const routePrefix = 'review';

export const reviewTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: taskActionTypeToTitleMap?.[requestTaskType],
    preContentComponent: ReviewActionButtonsComponent,
    sections: [
      {
        tasks: [
          {
            name: DETAILS_CHANGE_SUB_TASK,
            status: store.select(nocReviewQuery.selectStatusForSubtask(DETAILS_CHANGE_SUB_TASK))(),
            linkText: 'Details of the change',
            link: `${routePrefix}/details-change`,
          },
        ],
      },
    ],
  };
};

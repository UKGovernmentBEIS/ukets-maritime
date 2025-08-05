import { inject } from '@angular/core';

import { AuthStore, selectUserId } from '@netz/common/auth';
import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { doeCommonQuery, DoeSubtasks, maritimeEmissionsMap } from '@requests/common/doe';
import { DoePeerReviewActionButtonsComponent } from '@requests/tasks/doe-peer-review/components';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

const routePrefix = 'doe-peer-review';

export const doePeerReviewTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const authStore = inject(AuthStore);
  const currentUserId = authStore.select(selectUserId)();
  const assigneeUserId = store.select(requestTaskQuery.selectAssigneeUserId)();
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const year = store.select(doeCommonQuery.selectReportingYear)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType, year),
    preContentComponent: currentUserId === assigneeUserId ? DoePeerReviewActionButtonsComponent : undefined,
    sections: [
      {
        title: maritimeEmissionsMap.title,
        tasks: [
          {
            name: DoeSubtasks.MaritimeEmissions,
            status: TaskItemStatus.COMPLETED,
            linkText: maritimeEmissionsMap.title,
            link: `${routePrefix}/${DoeSubtasks.MaritimeEmissions}`,
          },
        ],
      },
    ],
  };
};

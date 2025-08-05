import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { notificationQuery } from '@requests/tasks/notification-submit/+state';
import { DETAILS_CHANGE_SUB_TASK } from '@requests/tasks/notification-submit/subtasks/details-change';
import { SUBMIT_TO_REGULATOR_SUB_TASK } from '@requests/tasks/notification-submit/subtasks/submit-notification-to-regulator';
import { taskActionTypeToTitleMap } from '@shared/constants';

const routePrefix = 'notification';

export const notificationTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const submitToRegulatorStatus = store.select(notificationQuery.selectStatusForSubtask('submitToRegulator'))();

  return {
    header: taskActionTypeToTitleMap?.[requestTaskType],
    sections: [
      {
        title: '',
        tasks: [
          {
            name: DETAILS_CHANGE_SUB_TASK,
            status: store.select(notificationQuery.selectStatusForSubtask('detailsOfChange'))(),
            linkText: 'Details of the change',
            link: `${routePrefix}/details-change`,
          },
          {
            name: SUBMIT_TO_REGULATOR_SUB_TASK,
            status: submitToRegulatorStatus,
            linkText: 'Submit to regulator',
            link: submitToRegulatorStatus === TaskItemStatus.CANNOT_START_YET ? null : `${routePrefix}/submit`,
          },
        ],
      },
    ],
  };
};

import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { followUpQuery } from '@requests/tasks/notification-follow-up/+state';
import { FOLLOW_UP_RESPONSE_SUB_TASK } from '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response.helper';
import { SUBMIT_TO_REGULATOR_SUB_TASK } from '@requests/tasks/notification-follow-up/subtasks/submit-to-regulator';
import { taskActionTypeToTitleMap } from '@shared/constants';

const routePrefix = 'follow-up';

export const followUpTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const submitToRegulatorStatus = store.select(followUpQuery.selectStatusForSubtask('submitToRegulator'))();

  return {
    header: taskActionTypeToTitleMap?.[requestTaskType],
    sections: [
      {
        tasks: [
          {
            name: FOLLOW_UP_RESPONSE_SUB_TASK,
            status: store.select(followUpQuery.selectStatusForSubtask('followUpResponse'))(),
            linkText: 'Follow-up response',
            link: `${routePrefix}/response/follow-up-response`,
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

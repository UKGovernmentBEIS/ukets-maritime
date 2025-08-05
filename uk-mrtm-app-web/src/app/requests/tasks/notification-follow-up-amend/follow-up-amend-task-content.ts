import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { followUpAmendQuery } from '@requests/tasks/notification-follow-up-amend/+state';
import { getFollowUpAmendHeader } from '@requests/tasks/notification-follow-up-amend/follow-up-amend.helper';
import { AMENDS_DETAILS_SUB_TASK } from '@requests/tasks/notification-follow-up-amend/subtasks/amends-details/amends-details.helper';
import { SUBMIT_TO_REGULATOR_SUB_TASK } from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-amend-submit';
import { FOLLOW_UP_RESPONSE_SUB_TASK } from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-response/response.helper';
import { followUpAmendMap } from '@requests/tasks/notification-follow-up-amend/subtasks/subtask-list.map';
import { RegulatorRequestedAmendComponent } from '@shared/components/regulator-requested-amend/regulator-requested-amend.component';

const routePrefix = 'follow-up-amend';

export const followUpAmendTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const submitToRegulatorStatus = store.select(
    followUpAmendQuery.selectStatusForSubtask(SUBMIT_TO_REGULATOR_SUB_TASK),
  )();

  return {
    header: getFollowUpAmendHeader(requestTaskType),
    postHeaderComponent: RegulatorRequestedAmendComponent,
    sections: [
      {
        tasks: [
          {
            name: AMENDS_DETAILS_SUB_TASK,
            status: store.select(followUpAmendQuery.selectStatusForSubtask(AMENDS_DETAILS_SUB_TASK))(),
            linkText: followUpAmendMap.amendsDetails.title,
            link: `${routePrefix}/details`,
          },
          {
            name: FOLLOW_UP_RESPONSE_SUB_TASK,
            status: store.select(followUpAmendQuery.selectStatusForSubtask(FOLLOW_UP_RESPONSE_SUB_TASK))(),
            linkText: followUpAmendMap.followUpResponse.title,
            link: `${routePrefix}/response`,
          },
          {
            name: SUBMIT_TO_REGULATOR_SUB_TASK,
            status: submitToRegulatorStatus,
            linkText: 'Submit',
            link: submitToRegulatorStatus === TaskItemStatus.CANNOT_START_YET ? null : `${routePrefix}/submit`,
          },
        ],
      },
    ],
  };
};

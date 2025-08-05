import { inject } from '@angular/core';

import { AuthStore, selectUserId } from '@netz/common/auth';
import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import {
  NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_PEER_REVIEW_ROUTE_PREFIX,
  NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_ROUTE_PREFIX,
  NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_UPLOAD_SUB_TASK,
  nonComplianceInitialPenaltyNoticeMap,
} from '@requests/common/non-compliance';
import { NonComplianceInitialPenaltyNoticePeerReviewActionButtonsComponent } from '@requests/tasks/non-compliance-initial-penalty-notice-peer-review/components';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const nonComplianceInitialPenaltyNoticePeerReviewTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const authStore = inject(AuthStore);
  const currentUserId = authStore.select(selectUserId)();
  const assigneeUserId = store.select(requestTaskQuery.selectAssigneeUserId)();
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType),
    preContentComponent:
      currentUserId === assigneeUserId ? NonComplianceInitialPenaltyNoticePeerReviewActionButtonsComponent : undefined,
    sections: [
      {
        title: nonComplianceInitialPenaltyNoticeMap.title,
        tasks: [
          {
            name: NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_UPLOAD_SUB_TASK,
            status: TaskItemStatus.COMPLETED,
            linkText: nonComplianceInitialPenaltyNoticeMap.caption,
            link: `${NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_PEER_REVIEW_ROUTE_PREFIX}/${NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_ROUTE_PREFIX}`,
          },
        ],
      },
    ],
  };
};

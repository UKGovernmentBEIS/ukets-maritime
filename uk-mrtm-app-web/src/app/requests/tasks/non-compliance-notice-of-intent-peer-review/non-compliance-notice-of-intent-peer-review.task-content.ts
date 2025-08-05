import { inject } from '@angular/core';

import { AuthStore, selectUserId } from '@netz/common/auth';
import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import {
  NON_COMPLIANCE_NOTICE_OF_INTENT_PEER_REVIEW_ROUTE_PREFIX,
  NON_COMPLIANCE_NOTICE_OF_INTENT_ROUTE_PREFIX,
  NON_COMPLIANCE_NOTICE_OF_INTENT_UPLOAD_SUB_TASK,
  nonComplianceNoticeOfIntentMap,
} from '@requests/common/non-compliance';
import { NonComplianceNoticeOfIntentPeerReviewActionButtonsComponent } from '@requests/tasks/non-compliance-notice-of-intent-peer-review/components';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const nonComplianceNoticeOfIntentPeerReviewTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const authStore = inject(AuthStore);
  const currentUserId = authStore.select(selectUserId)();
  const assigneeUserId = store.select(requestTaskQuery.selectAssigneeUserId)();
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType),
    preContentComponent:
      currentUserId === assigneeUserId ? NonComplianceNoticeOfIntentPeerReviewActionButtonsComponent : undefined,
    sections: [
      {
        title: nonComplianceNoticeOfIntentMap.title,
        tasks: [
          {
            name: NON_COMPLIANCE_NOTICE_OF_INTENT_UPLOAD_SUB_TASK,
            status: TaskItemStatus.COMPLETED,
            linkText: nonComplianceNoticeOfIntentMap.caption,
            link: `${NON_COMPLIANCE_NOTICE_OF_INTENT_PEER_REVIEW_ROUTE_PREFIX}/${NON_COMPLIANCE_NOTICE_OF_INTENT_ROUTE_PREFIX}`,
          },
        ],
      },
    ],
  };
};

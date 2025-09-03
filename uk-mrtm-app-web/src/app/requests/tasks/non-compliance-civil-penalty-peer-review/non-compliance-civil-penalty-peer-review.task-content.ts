import { inject } from '@angular/core';

import { AuthStore, selectUserId } from '@netz/common/auth';
import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import {
  NON_COMPLIANCE_CIVIL_PENALTY_PEER_REVIEW_ROUTE_PREFIX,
  NON_COMPLIANCE_CIVIL_PENALTY_ROUTE_PREFIX,
  NON_COMPLIANCE_CIVIL_PENALTY_UPLOAD_SUB_TASK,
  nonComplianceCivilPenaltyMap,
} from '@requests/common/non-compliance';
import { NonComplianceCivilPenaltyPeerReviewActionButtonsComponent } from '@requests/tasks/non-compliance-civil-penalty-peer-review/components';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const nonComplianceCivilPenaltyPeerReviewTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const authStore = inject(AuthStore);
  const currentUserId = authStore.select(selectUserId)();
  const assigneeUserId = store.select(requestTaskQuery.selectAssigneeUserId)();
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType),
    preContentComponent:
      currentUserId === assigneeUserId ? NonComplianceCivilPenaltyPeerReviewActionButtonsComponent : undefined,
    sections: [
      {
        title: nonComplianceCivilPenaltyMap.title,
        tasks: [
          {
            name: NON_COMPLIANCE_CIVIL_PENALTY_UPLOAD_SUB_TASK,
            status: TaskItemStatus.COMPLETED,
            linkText: nonComplianceCivilPenaltyMap.caption,
            link: `${NON_COMPLIANCE_CIVIL_PENALTY_PEER_REVIEW_ROUTE_PREFIX}/${NON_COMPLIANCE_CIVIL_PENALTY_ROUTE_PREFIX}`,
          },
        ],
      },
    ],
  };
};

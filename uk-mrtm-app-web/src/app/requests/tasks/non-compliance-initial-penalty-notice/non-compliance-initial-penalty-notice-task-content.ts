import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import {
  NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_ROUTE_PREFIX,
  NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_UPLOAD_SUB_TASK,
  nonComplianceInitialPenaltyNoticeMap,
} from '@requests/common/non-compliance';
import { nonComplianceInitialPenaltyNoticeCommonQuery } from '@requests/common/non-compliance/non-compliance-initial-penalty-notice/+state';
import { NonComplianceInitialPenaltyNoticeActionButtonsComponent } from '@requests/tasks/non-compliance-initial-penalty-notice/components';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const nonComplianceInitialPenaltyNoticeTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType),
    preContentComponent: NonComplianceInitialPenaltyNoticeActionButtonsComponent,
    sections: [
      {
        title: nonComplianceInitialPenaltyNoticeMap.title,
        tasks: [
          {
            name: NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_UPLOAD_SUB_TASK,
            status: store.select(nonComplianceInitialPenaltyNoticeCommonQuery.selectStatusForUploadSubtask)(),
            linkText: nonComplianceInitialPenaltyNoticeMap.caption,
            link: NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_ROUTE_PREFIX,
          },
        ],
      },
    ],
  };
};

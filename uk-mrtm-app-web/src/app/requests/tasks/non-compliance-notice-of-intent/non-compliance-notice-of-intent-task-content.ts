import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import {
  NON_COMPLIANCE_NOTICE_OF_INTENT_ROUTE_PREFIX,
  NON_COMPLIANCE_NOTICE_OF_INTENT_UPLOAD_SUB_TASK,
  nonComplianceNoticeOfIntentMap,
} from '@requests/common/non-compliance';
import { nonComplianceNoticeOfIntentCommonQuery } from '@requests/common/non-compliance/non-compliance-notice-of-intent/+state';
import { NonComplianceNoticeOfIntentActionButtonsComponent } from '@requests/tasks/non-compliance-notice-of-intent/components';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const nonComplianceNoticeOfIntentTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType),
    preContentComponent: NonComplianceNoticeOfIntentActionButtonsComponent,
    sections: [
      {
        title: nonComplianceNoticeOfIntentMap.title,
        tasks: [
          {
            name: NON_COMPLIANCE_NOTICE_OF_INTENT_UPLOAD_SUB_TASK,
            status: store.select(nonComplianceNoticeOfIntentCommonQuery.selectStatusForUploadSubtask)(),
            linkText: nonComplianceNoticeOfIntentMap.caption,
            link: NON_COMPLIANCE_NOTICE_OF_INTENT_ROUTE_PREFIX,
          },
        ],
      },
    ],
  };
};

import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import {
  NON_COMPLIANCE_FINAL_DETERMINATION_DETAILS_SUB_TASK,
  NON_COMPLIANCE_FINAL_DETERMINATION_ROUTE_PREFIX,
  nonComplianceFinalDeterminationDetailsMap,
} from '@requests/common/non-compliance';
import { nonComplianceFinalDeterminationQuery } from '@requests/tasks/non-compliance-final-determination/+state';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const nonComplianceFinalDeterminationTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType),
    sections: [
      {
        title: 'Non-compliance conclusion details',
        tasks: [
          {
            name: NON_COMPLIANCE_FINAL_DETERMINATION_DETAILS_SUB_TASK,
            status: store.select(nonComplianceFinalDeterminationQuery.selectStatusForDetailsSubtask)(),
            linkText: nonComplianceFinalDeterminationDetailsMap.caption,
            link: NON_COMPLIANCE_FINAL_DETERMINATION_ROUTE_PREFIX,
          },
        ],
      },
    ],
  };
};

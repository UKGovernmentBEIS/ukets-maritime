import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { RequestTaskStore } from '@netz/common/store';

import {
  NON_COMPLIANCE_DETAILS_SUB_TASK,
  NON_COMPLIANCE_SUBMIT_ROUTE_PREFIX,
  nonComplianceDetailsMap,
} from '@requests/common/non-compliance';
import { nonComplianceSubmitQuery } from '@requests/tasks/non-compliance-submit/+state';

export const nonComplianceSubmitTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);

  return {
    header: nonComplianceDetailsMap.title,
    sections: [
      {
        title: 'Type of non-compliance',
        tasks: [
          {
            name: NON_COMPLIANCE_DETAILS_SUB_TASK,
            status: store.select(nonComplianceSubmitQuery.selectStatusForDetailsSubtask)(),
            linkText: nonComplianceDetailsMap.caption,
            link: NON_COMPLIANCE_SUBMIT_ROUTE_PREFIX,
          },
        ],
      },
    ],
  };
};

import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import {
  NON_COMPLIANCE_CIVIL_PENALTY_ROUTE_PREFIX,
  NON_COMPLIANCE_CIVIL_PENALTY_UPLOAD_SUB_TASK,
  nonComplianceCivilPenaltyMap,
} from '@requests/common/non-compliance';
import { nonComplianceCivilPenaltyCommonQuery } from '@requests/common/non-compliance/non-compliance-civil-penalty/+state';
import { NonComplianceCivilPenaltyActionButtonsComponent } from '@requests/tasks/non-compliance-civil-penalty/components';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const nonComplianceCivilPenaltyTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType),
    preContentComponent: NonComplianceCivilPenaltyActionButtonsComponent,
    sections: [
      {
        title: nonComplianceCivilPenaltyMap.title,
        tasks: [
          {
            name: NON_COMPLIANCE_CIVIL_PENALTY_UPLOAD_SUB_TASK,
            status: store.select(nonComplianceCivilPenaltyCommonQuery.selectStatusForUploadSubtask)(),
            linkText: nonComplianceCivilPenaltyMap.caption,
            link: NON_COMPLIANCE_CIVIL_PENALTY_ROUTE_PREFIX,
          },
        ],
      },
    ],
  };
};

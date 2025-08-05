import { inject } from '@angular/core';

import { AerApplicationSubmittedRequestActionPayload } from '@mrtm/api';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { getAerSubmittedSubtaskSections } from '@requests/common/aer/helpers';
import { reportingObligationMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import {
  REPORTING_OBLIGATION_SUB_TASK,
  REPORTING_OBLIGATION_SUB_TASK_PATH,
} from '@requests/common/aer/subtasks/reporting-obligation';
import { timelineCommonQuery } from '@requests/common/timeline';
import { AER_SUBMITTED_ROUTE_PREFIX } from '@requests/timeline/aer-submitted/aer-submitted.routes';
import { taskActionTypeToTitleTransformer } from '@shared/utils/transformers';

export const aerSubmittedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();
  const payload: AerApplicationSubmittedRequestActionPayload = store.select(requestActionQuery.selectActionPayload)();
  const year = store.select(timelineCommonQuery.selectReportingYear)();
  const hasReportingObligation = payload?.reportingRequired === true;

  return {
    header: taskActionTypeToTitleTransformer(actionType, year),
    sections: [
      {
        title: reportingObligationMap.title,
        tasks: [
          {
            name: REPORTING_OBLIGATION_SUB_TASK,
            status: '',
            linkText: reportingObligationMap.title,
            link: `${AER_SUBMITTED_ROUTE_PREFIX}/${REPORTING_OBLIGATION_SUB_TASK_PATH}`,
          },
        ],
      },
      ...(hasReportingObligation ? getAerSubmittedSubtaskSections(AER_SUBMITTED_ROUTE_PREFIX, payload?.aer) : []),
    ],
  };
};

import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { timelineCommonQuery } from '@requests/common';
import { reportingObligationMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import {
  REPORTING_OBLIGATION_SUB_TASK,
  REPORTING_OBLIGATION_SUB_TASK_PATH,
} from '@requests/common/aer/subtasks/reporting-obligation';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import { AER_REVIEWED_ROUTE_PREFIX } from '@requests/timeline/aer-reviewed/aer-reviewed.constants';
import { AerReviewedTasksListComponent } from '@requests/timeline/aer-reviewed/components';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const aerReviewedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();
  const year = store.select(timelineCommonQuery.selectReportingYear)();
  const hasReportingObligation = store.select(aerTimelineCommonQuery.selectReportingRequired)();

  return {
    header: taskActionTypeToTitleTransformer(actionType, year),
    headerSize: hasReportingObligation ? 'xl' : 'l',
    component: hasReportingObligation ? AerReviewedTasksListComponent : undefined,
    sections: !hasReportingObligation
      ? [
          {
            title: reportingObligationMap.title,
            tasks: [
              {
                name: REPORTING_OBLIGATION_SUB_TASK,
                linkText: reportingObligationMap.title,
                status: '',
                link: `${AER_REVIEWED_ROUTE_PREFIX}/${REPORTING_OBLIGATION_SUB_TASK_PATH}`,
              },
            ],
          },
        ]
      : undefined,
  };
};

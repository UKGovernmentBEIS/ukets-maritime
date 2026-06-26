import { inject } from '@angular/core';

import { AerApplicationSubmittedRequestActionPayload } from '@mrtm/api';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { reportingObligationMap } from '@requests/common/aer';
import {
  REPORTING_OBLIGATION_SUB_TASK,
  REPORTING_OBLIGATION_SUB_TASK_PATH,
} from '@requests/common/aer/subtasks/reporting-obligation';
import { timelineCommonQuery } from '@requests/common/timeline';
import { AER_REVIEW_SKIPPED_ROUTE_PREFIX } from '@requests/timeline/aer-review-skipped/aer-review-skipped.routes';
import { AerReviewSkippedComponent } from '@requests/timeline/aer-review-skipped/components';
import { taskActionTypeToTitleTransformer } from '@shared/utils/transformers';

export const aerReviewSkippedTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const actionType = store.select(requestActionQuery.selectActionType)();
  const payload: AerApplicationSubmittedRequestActionPayload = store.select(requestActionQuery.selectActionPayload)();
  const year = store.select(timelineCommonQuery.selectReportingYear)();

  const hasReportingObligation = payload?.reportingRequired === true;

  return {
    header: taskActionTypeToTitleTransformer(actionType, year),
    headerSize: 'xl',
    component: hasReportingObligation ? AerReviewSkippedComponent : null,
    sections: hasReportingObligation
      ? null
      : [
          {
            title: reportingObligationMap.title,
            tasks: [
              {
                name: REPORTING_OBLIGATION_SUB_TASK,
                status: '',
                linkText: reportingObligationMap.title,
                link: `${AER_REVIEW_SKIPPED_ROUTE_PREFIX}/${REPORTING_OBLIGATION_SUB_TASK_PATH}`,
              },
            ],
          },
        ],
  };
};

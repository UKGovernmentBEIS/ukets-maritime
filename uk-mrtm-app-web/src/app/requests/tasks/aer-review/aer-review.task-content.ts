import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { reportingObligationMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import {
  REPORTING_OBLIGATION_SUB_TASK,
  REPORTING_OBLIGATION_SUB_TASK_PATH,
} from '@requests/common/aer/subtasks/reporting-obligation';
import { aerReviewQuery } from '@requests/tasks/aer-review/+state';
import {
  AER_REVIEW_NO_OBLIGATION_ROUTE_PREFIX,
  AER_REVIEW_ROUTE_PREFIX,
} from '@requests/tasks/aer-review/aer-review.constants';
import { AerReviewActionButtonsComponent, AerReviewSubtasksListComponent } from '@requests/tasks/aer-review/components';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const aerReviewTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const year = store.select(aerCommonQuery.selectReportingYear)();

  const hasReportingObligation = store.select(aerCommonQuery.selectReportingRequired)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType, year),
    preContentComponent: AerReviewActionButtonsComponent,
    headerSize: hasReportingObligation ? 'xl' : 'l',
    contentComponent: hasReportingObligation ? AerReviewSubtasksListComponent : undefined,
    sections: !hasReportingObligation
      ? [
          {
            title: reportingObligationMap.title,
            tasks: [
              {
                name: REPORTING_OBLIGATION_SUB_TASK,
                linkText: reportingObligationMap.title,
                status: store.select(
                  aerReviewQuery.selectStatusForSubtask(REPORTING_OBLIGATION_SUB_TASK, TaskItemStatus.UNDECIDED),
                )(),
                link: `${AER_REVIEW_ROUTE_PREFIX}/${AER_REVIEW_NO_OBLIGATION_ROUTE_PREFIX}/${REPORTING_OBLIGATION_SUB_TASK_PATH}`,
              },
            ],
          },
        ]
      : undefined,
  };
};

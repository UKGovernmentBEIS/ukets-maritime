import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerWaitForReviewComponent } from '@requests/tasks/aer-wait-for-review/components';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const aerWaitForReviewTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const year = store.select(aerCommonQuery.selectReportingYear)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType, year),
    contentComponent: AerWaitForReviewComponent,
  };
};

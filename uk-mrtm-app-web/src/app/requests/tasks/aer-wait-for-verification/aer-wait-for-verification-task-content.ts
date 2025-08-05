import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerWaitForVerificationComponent } from '@requests/tasks/aer-wait-for-verification/components';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const aerWaitForVerificationTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const year = store.select(aerCommonQuery.selectReportingYear)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType, year),
    contentComponent: AerWaitForVerificationComponent,
  };
};

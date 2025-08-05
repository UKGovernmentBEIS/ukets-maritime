import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { RequestForInformationComponent } from '@requests/common/emp/request-for-information/request-for-information.component';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const requestForInformationWaitForResponseTaskContent: RequestTaskPageContentFactory = () => {
  const store: RequestTaskStore = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: taskActionTypeToTitleMap?.[requestTaskType],
    contentComponent: RequestForInformationComponent,
  };
};

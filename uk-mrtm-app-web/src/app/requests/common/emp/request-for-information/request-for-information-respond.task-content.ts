import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { RequestForInformationRespondFormComponent } from '@requests/common/emp/request-for-information/request-for-information-respond-form';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const requestForInformationRespondTaskContent: RequestTaskPageContentFactory = () => {
  const store: RequestTaskStore = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: taskActionTypeToTitleMap?.[requestTaskType],
    contentComponent: RequestForInformationRespondFormComponent,
  };
};

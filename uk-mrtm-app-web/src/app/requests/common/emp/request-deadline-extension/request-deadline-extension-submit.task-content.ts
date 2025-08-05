import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { RequestDeadlineExtensionDecisionComponent } from '@requests/common/emp/request-deadline-extension/request-deadline-extension-decision';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const requestDeadlineExtensionSubmitTaskContent: RequestTaskPageContentFactory = () => {
  const store: RequestTaskStore = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: taskActionTypeToTitleMap?.[requestTaskType],
    contentComponent: RequestDeadlineExtensionDecisionComponent,
  };
};

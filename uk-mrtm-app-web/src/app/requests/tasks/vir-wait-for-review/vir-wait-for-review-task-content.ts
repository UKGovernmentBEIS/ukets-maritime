import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { virCommonQuery } from '@requests/common/vir/+state';
import { TaskContentComponent } from '@requests/tasks/vir-wait-for-review/components';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const virWaitForReviewTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const year = store.select(virCommonQuery.selectYear)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType, year),
    contentComponent: TaskContentComponent,
  };
};

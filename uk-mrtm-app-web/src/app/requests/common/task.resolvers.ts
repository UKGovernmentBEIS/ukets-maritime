import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { getYearFromRequestId } from '@netz/common/utils';

import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const taskTitleResolver: ResolveFn<string> = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const requestId = store.select(requestTaskQuery.selectRequestId)();
  const year = getYearFromRequestId(requestId);

  return taskActionTypeToTitleTransformer(requestTaskType, year);
};

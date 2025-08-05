import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { paymentQuery } from '@requests/tasks/payment/+state';
import { PaymentDetailsComponent } from '@requests/tasks/payment/components';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

export const paymentTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();
  const year = store.select(paymentQuery.selectYear)();

  return {
    header: taskActionTypeToTitleTransformer(requestTaskType, year),
    contentComponent: PaymentDetailsComponent,
  };
};

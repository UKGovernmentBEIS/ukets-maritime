import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { PaymentStatusDetailsComponent } from '@requests/timeline/payment/payment-status-details';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const paymentTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const action = store.select(requestActionQuery.selectAction)();

  return {
    header: taskActionTypeToTitleMap?.[action?.type],
    component: PaymentStatusDetailsComponent,
    sections: [],
  };
};

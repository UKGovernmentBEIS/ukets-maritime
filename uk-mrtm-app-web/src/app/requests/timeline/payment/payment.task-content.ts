import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { itemActionToPaymentTitleTransformer } from '@requests/timeline/payment/payment.helpers';
import { PaymentStatusDetailsComponent } from '@requests/timeline/payment/payment-status-details';

export const paymentTaskContent: RequestTaskPageContentFactory = () => {
  const store = inject(RequestActionStore);
  const action = store.select(requestActionQuery.selectAction)();

  return {
    header: itemActionToPaymentTitleTransformer(action?.type, action?.submitter),
    component: PaymentStatusDetailsComponent,
    sections: [],
  };
};

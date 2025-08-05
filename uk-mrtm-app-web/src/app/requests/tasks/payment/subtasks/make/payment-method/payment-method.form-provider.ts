import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { paymentQuery } from '@requests/tasks/payment/+state';
import {
  PaymentMethodFormGroupModel,
  PaymentMethodFormModel,
} from '@requests/tasks/payment/subtasks/make/payment-method/payment-method.types';

export const paymentMethodFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore): PaymentMethodFormGroupModel => {
    const selectedPaymentMethod = store.select(paymentQuery.selectPaymentMethod)();

    return formBuilder.group({
      paymentMethod: formBuilder.control<PaymentMethodFormModel['paymentMethod'] | null>(
        selectedPaymentMethod ?? null,
        {
          validators: GovukValidators.required('Select a payment method'),
          updateOn: 'change',
        },
      ),
    });
  },
};

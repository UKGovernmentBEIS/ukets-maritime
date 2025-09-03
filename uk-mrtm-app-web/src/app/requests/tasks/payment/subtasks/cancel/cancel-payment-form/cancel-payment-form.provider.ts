import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import {
  CancelPaymentFormGroupModel,
  CancelPaymentFormModel,
} from '@requests/tasks/payment/subtasks/cancel/cancel-payment-form/cancel-payment-form.types';

export const cancelPaymentFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder],
  useFactory: (formBuilder: FormBuilder): CancelPaymentFormGroupModel =>
    formBuilder.group({
      reason: formBuilder.control<CancelPaymentFormModel['reason'] | null>(null, {
        validators: [
          GovukValidators.required('Enter the reason that no payment is required'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      }),
    }),
};

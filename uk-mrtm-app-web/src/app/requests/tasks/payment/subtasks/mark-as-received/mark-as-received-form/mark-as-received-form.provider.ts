import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import {
  MarkAsReceivedFormGroupModel,
  MarkAsReceivedFormModel,
} from '@requests/tasks/payment/subtasks/mark-as-received/mark-as-received-form/mark-as-received-form.types';

export const markAsReceivedFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder],
  useFactory: (formBuilder: FormBuilder): MarkAsReceivedFormGroupModel =>
    formBuilder.group({
      receivedDate: formBuilder.control<MarkAsReceivedFormModel['receivedDate'] | null>(null, {
        validators: GovukValidators.required('Received date is required'),
      }),
    }),
};

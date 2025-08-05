import { FactoryProvider } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { getNotifyOperatorConfigByRequestType } from '@requests/common/components/notify-operator/notify-operator-form/notify-operator-form.helpers';
import { TASK_FORM } from '@requests/common/task-form.token';

export const notifyOperatorFormProvider: FactoryProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const taskType = store.select(requestTaskQuery.selectRequestTaskType)();
    const config = getNotifyOperatorConfigByRequestType(taskType);
    const baseFormGroup = {
      operators: [[], { updateOn: 'change' }],
      externalContacts: [[], { updateOn: 'change' }],
    };

    return config.hasSignatoryField
      ? fb.group({
          ...baseFormGroup,
          signatory: [null, GovukValidators.required('Select a name to appear on the official notice document.')],
        })
      : fb.group(baseFormGroup);
  },
};

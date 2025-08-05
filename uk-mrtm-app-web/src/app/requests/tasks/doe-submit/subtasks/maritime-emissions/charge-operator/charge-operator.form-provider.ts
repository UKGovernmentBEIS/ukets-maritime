import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { doeSubmitQuery } from '@requests/tasks/doe-submit/+state';

export const chargeOperatorFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (fb: FormBuilder, store: RequestTaskStore): FormGroup => {
    const chargeOperator = store.select(doeSubmitQuery.selectChargeOperator)();

    return fb.group({
      chargeOperator: fb.control<boolean>(chargeOperator ?? null, {
        validators: [GovukValidators.required('Select yes if you need to charge the operator a fee')],
      }),
    });
  },
};

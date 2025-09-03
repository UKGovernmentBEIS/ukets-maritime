import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import {
  MandateResponsibilityFormGroupModel,
  MandateResponsibilityFormModel,
} from '@requests/common/emp/subtasks/mandate/mandate-responsibility/mandate-responsibility.types';
import { TASK_FORM } from '@requests/common/task-form.token';

export const mandateResponsibilityFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore): FormGroup<MandateResponsibilityFormGroupModel> => {
    const mandate = store.select(empCommonQuery.selectMandate)();

    return formBuilder.group<MandateResponsibilityFormGroupModel>({
      exist: formBuilder.control<MandateResponsibilityFormModel['exist'] | null>(mandate?.exist, {
        validators: GovukValidators.required(
          'Select yes if has the responsibility for compliance with UK ETS been delegated to you by one or more registered owners for one or more ships',
        ),
      }),
    });
  },
};

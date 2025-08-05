import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { EmpOperatorDetails } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { TASK_FORM } from '@requests/common/task-form.token';

export const undertakenActivitiesFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const operatorDetails = store.select(empCommonQuery.selectOperatorDetails)();

    return formBuilder.group({
      activityDescription: formBuilder.control<EmpOperatorDetails['activityDescription'] | null>(
        operatorDetails?.activityDescription ?? null,
        {
          validators: [
            GovukValidators.required(
              'Enter a description of the maritime activities carried out by the Maritime Operator',
            ),
            GovukValidators.maxLength(10000, 'Description should not be more than 10000 characters'),
          ],
        },
      ),
    });
  },
};

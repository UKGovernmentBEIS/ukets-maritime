import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { TASK_FORM } from '@requests/common/task-form.token';

export const monitoringPlanChangesFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const monitoringPlanChanges = store.select(aerCommonQuery.selectMonitoringPlanChanges)();

    return formBuilder.group({
      changesExist: formBuilder.control<boolean>(monitoringPlanChanges?.changesExist, {
        updateOn: 'change',
        validators: [GovukValidators.required('Select yes if there were changes')],
      }),
      changes: formBuilder.control<string>(
        {
          value: monitoringPlanChanges?.changes ?? null,
          disabled: !monitoringPlanChanges?.changesExist,
        },
        {
          validators: [
            GovukValidators.required('Enter any changes that were not covered in the reporting year.'),
            GovukValidators.maxLength(
              10000,
              'The changes not covered in the reporting year must be 10,000 characters or fewer.',
            ),
          ],
        },
      ),
    });
  },
};

import { inject, Provider } from '@angular/core';
import { FormBuilder, UntypedFormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY } from '@requests/+state';
import { TASK_FORM } from '@requests/common/task-form.token';
import { getLocationStateFormGroup } from '@shared/components';

export const operatorDetailsStepFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const commonSubtaskStepsQuery = inject(REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY);
    const operatorDetails = store.select(commonSubtaskStepsQuery.selectOperatorDetails)();
    return formBuilder.group({
      operatorName: formBuilder.control<string | null>(operatorDetails?.operatorName ?? null, {
        validators: [
          GovukValidators.required('Enter operator’s name'),
          GovukValidators.maxLength(256, 'Operator name should not be more than 256 characters'),
        ],
      }),
      imoNumber: formBuilder.control<string | null>(
        {
          value: operatorDetails?.imoNumber ?? null,
          disabled: true,
        },
        {
          validators: [
            GovukValidators.required('Enter company’s IMO Number'),
            GovukValidators.pattern(/^\d{7}$/, 'Enter a 7 digit number'),
          ],
        },
      ),
      contactAddress: formBuilder.group({
        ...getLocationStateFormGroup(operatorDetails?.contactAddress),
      }),
    });
  },
};

import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerDataGapsMethodologies } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const dataGapsMethodologiesMisstatementProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const dataGapsMethodologies = store.select(aerVerificationSubmitQuery.selectDataGapsMethodologies)();
    const materialMisstatementExist = formBuilder.control<AerDataGapsMethodologies['materialMisstatementExist']>(
      dataGapsMethodologies?.materialMisstatementExist,
      {
        updateOn: 'change',
        validators: [GovukValidators.required('Select yes if the method led to a material misstatement')],
      },
    );

    return formBuilder.group({
      materialMisstatementExist,
      materialMisstatementDetails: formBuilder.control<AerDataGapsMethodologies['materialMisstatementDetails']>(
        {
          value: dataGapsMethodologies?.materialMisstatementDetails,
          disabled: !(materialMisstatementExist.value === false),
        },
        [
          GovukValidators.required('Enter more details'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ),
    });
  },
};

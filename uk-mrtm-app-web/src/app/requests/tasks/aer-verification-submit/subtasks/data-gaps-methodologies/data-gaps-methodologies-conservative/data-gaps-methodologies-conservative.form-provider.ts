import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerDataGapsMethodologies } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const dataGapsMethodologiesConservativeProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const dataGapsMethodologies = store.select(aerVerificationSubmitQuery.selectDataGapsMethodologies)();
    const methodConservative = formBuilder.control<AerDataGapsMethodologies['methodConservative']>(
      dataGapsMethodologies?.methodConservative,
      {
        updateOn: 'change',
        validators: [GovukValidators.required('Select yes if the method used was conservative')],
      },
    );

    return formBuilder.group({
      methodConservative,
      noConservativeMethodDetails: formBuilder.control<AerDataGapsMethodologies['noConservativeMethodDetails']>(
        {
          value: dataGapsMethodologies?.noConservativeMethodDetails,
          disabled: !(methodConservative.value === false),
        },
        [
          GovukValidators.required('Enter more details'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ),
    });
  },
};

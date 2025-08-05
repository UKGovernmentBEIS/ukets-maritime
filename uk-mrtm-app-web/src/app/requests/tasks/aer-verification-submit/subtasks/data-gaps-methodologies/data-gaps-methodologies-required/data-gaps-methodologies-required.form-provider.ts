import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerDataGapsMethodologies } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const dataGapsMethodologiesRequiredProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const dataGapsMethodologies = store.select(aerVerificationSubmitQuery.selectDataGapsMethodologies)();

    return formBuilder.group({
      methodRequired: formBuilder.control<AerDataGapsMethodologies['methodRequired']>(
        dataGapsMethodologies?.methodRequired,
        {
          validators: [
            GovukValidators.required('Select yes if a data gap method was required during the reporting year'),
          ],
        },
      ),
    });
  },
};

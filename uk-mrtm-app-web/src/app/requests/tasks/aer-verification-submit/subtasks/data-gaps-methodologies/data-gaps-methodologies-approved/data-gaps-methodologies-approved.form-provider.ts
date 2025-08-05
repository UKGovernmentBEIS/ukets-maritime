import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerDataGapsMethodologies } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const dataGapsMethodologiesApprovedProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const dataGapsMethodologies = store.select(aerVerificationSubmitQuery.selectDataGapsMethodologies)();

    return formBuilder.group({
      methodApproved: formBuilder.control<AerDataGapsMethodologies['methodApproved']>(
        dataGapsMethodologies?.methodApproved,
        {
          validators: [
            GovukValidators.required('Select yes if the data gap method has already been approved by the regulator'),
          ],
        },
      ),
    });
  },
};

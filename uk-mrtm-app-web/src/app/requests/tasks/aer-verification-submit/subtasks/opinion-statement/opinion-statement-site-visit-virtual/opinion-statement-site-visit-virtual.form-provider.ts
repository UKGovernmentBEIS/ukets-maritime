import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerVirtualSiteVisit } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const opinionStatementSiteVisitVirtualFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const opinionStatement = store.select(aerVerificationSubmitQuery.selectOpinionStatement)();

    return formBuilder.group({
      reason: formBuilder.control<AerVirtualSiteVisit['reason']>(
        (opinionStatement?.siteVisit as AerVirtualSiteVisit)?.reason,
        {
          validators: [
            GovukValidators.required('Explain the reason(s) why a virtual site visit was made'),
            GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
          ],
        },
      ),
    });
  },
};

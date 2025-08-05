import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { AerSiteVisitType } from '@requests/common/aer/aer.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const opinionStatementSiteVisitTypeFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const opinionStatement = store.select(aerVerificationSubmitQuery.selectOpinionStatement)();

    return formBuilder.group({
      siteVisitType: formBuilder.control<AerSiteVisitType>(opinionStatement?.siteVisit?.type, {
        validators: [GovukValidators.required('Select if your team made any in-person or virtual site visits')],
      }),
    });
  },
};

import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerUncorrectedNonConformities } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const uncorrectedNonConformitiesPriorYearIssuesExistProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const uncorrectedNonConformities = store.select(aerVerificationSubmitQuery.selectUncorrectedNonConformities)();

    return formBuilder.group({
      existPriorYearIssues: formBuilder.control<AerUncorrectedNonConformities['existPriorYearIssues']>(
        uncorrectedNonConformities?.existPriorYearIssues,
        [
          GovukValidators.required(
            'Select yes if there are any non-conformities from the previous year that have not been resolved',
          ),
        ],
      ),
    });
  },
};

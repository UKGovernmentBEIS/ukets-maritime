import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { NonComplianceSubmitTaskPayload } from '@requests/common/non-compliance';
import { TASK_FORM } from '@requests/common/task-form.token';
import { nonComplianceSubmitQuery } from '@requests/tasks/non-compliance-submit/+state';

export const nonComplianceDetailsCivilPenaltyProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const nonComplianceDetails = store.select(nonComplianceSubmitQuery.selectNonComplianceDetails)();

    return formBuilder.group({
      civilPenalty: formBuilder.control<NonComplianceSubmitTaskPayload['civilPenalty'] | null>(
        nonComplianceDetails?.civilPenalty,
        { validators: [GovukValidators.required('Select yes or no')] },
      ),
      noCivilPenaltyJustification: formBuilder.control<NonComplianceSubmitTaskPayload['noCivilPenaltyJustification']>(
        {
          value: nonComplianceDetails?.noCivilPenaltyJustification ?? null,
          disabled: nonComplianceDetails?.civilPenalty !== false,
        },
        [
          GovukValidators.required('You must enter a reason'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ),
    });
  },
};

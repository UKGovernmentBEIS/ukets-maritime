import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const opinionStatementEmissionsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const opinionStatement = store.select(aerVerificationSubmitQuery.selectOpinionStatement)();
    const emissionsCorrect = formBuilder.control<boolean>(opinionStatement?.emissionsCorrect, {
      updateOn: 'change',
      validators: [
        GovukValidators.required('Select yes if the reported and surrender obligation emissions are correct'),
      ],
    });

    return formBuilder.group({
      emissionsCorrect,
      manuallyProvidedTotalEmissions: formBuilder.control<string>(
        {
          value: opinionStatement?.manuallyProvidedTotalEmissions ?? null,
          disabled: emissionsCorrect.value !== false,
        },
        [
          GovukValidators.required('Enter the total verified maritime emissions for the scheme year'),
          GovukValidators.integerNumber('Enter a whole number equal to or greater than 0'),
        ],
      ),
      manuallyProvidedLess5PercentIceClassDeduction: formBuilder.control<string>(
        {
          value: opinionStatement?.manuallyProvidedLess5PercentIceClassDeduction ?? null,
          disabled: emissionsCorrect.value !== false,
        },
        [
          GovukValidators.required('Enter the verified 5% ice class deduction'),
          GovukValidators.integerNumber('Enter a whole number equal to or greater than 0'),
        ],
      ),
      manuallyProvidedLessIslandFerryDeduction: formBuilder.control<string>(
        {
          value: opinionStatement?.manuallyProvidedLessIslandFerryDeduction ?? null,
          disabled: emissionsCorrect.value !== false,
        },
        [
          GovukValidators.required('Enter the verified small island ferry deduction'),
          GovukValidators.integerNumber('Enter a whole number equal to or greater than 0'),
        ],
      ),
      manuallyProvidedSurrenderEmissions: formBuilder.control<string>(
        {
          value: opinionStatement?.manuallyProvidedSurrenderEmissions ?? null,
          disabled: emissionsCorrect.value !== false,
        },
        [
          GovukValidators.required('Enter the emissions figure for surrender for the scheme year'),
          GovukValidators.integerNumber('Enter a whole number equal to or greater than 0'),
        ],
      ),
    });
  },
};

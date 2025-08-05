import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { EmpVariationRegulatorLedReason } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empVariationRegulatorQuery, TASK_FORM } from '@requests/common';
import { VariationDetailsSummaryFormGroupModel } from '@requests/common/emp/subtasks/variation-details/variation-details-summary-form/variation-details-summary-form.types';

export const variationDetailsSummaryFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore): FormGroup<VariationDetailsSummaryFormGroupModel> =>
    new FormGroup({
      summary: formBuilder.control<EmpVariationRegulatorLedReason['summary'] | null>(
        store.select(empVariationRegulatorQuery.selectReasonRegulatorLed)()?.summary ?? null,
        {
          validators: [
            GovukValidators.required('Enter a summary'),
            GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
          ],
        },
      ),
    }),
};

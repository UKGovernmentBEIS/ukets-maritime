import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import {
  ExemptionConditionsFormModel,
  ExemptionConditionsFormType,
} from '@requests/common/emp/subtasks/emissions/exemption-conditions/exemption-conditions.types';
import { TASK_FORM } from '@requests/common/task-form.token';

export const exemptionConditionsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore, ActivatedRoute],
  useFactory: (
    fb: FormBuilder,
    store: RequestTaskStore,
    route: ActivatedRoute,
  ): FormGroup<ExemptionConditionsFormModel> => {
    const shipId = route.snapshot.params['shipId'];
    const exemptionConditions = store.select(empCommonQuery.selectExemptionConditions(shipId))();

    return fb.group<ExemptionConditionsFormModel>({
      shipId: fb.control<ExemptionConditionsFormType['shipId'] | null>(shipId),
      exist: fb.control<ExemptionConditionsFormType['exist'] | null>(exemptionConditions?.exist ?? null, {
        validators: [
          GovukValidators.required(
            'Select yes if you intend to make use of the derogation for monitoring the amount of fuel consumed on a per-voyage basis',
          ),
        ],
      }),
      minVoyages: fb.control<ExemptionConditionsFormType['minVoyages'] | null>(
        {
          value: exemptionConditions?.minVoyages ?? null,
          disabled: exemptionConditions?.minVoyages === 0,
        },
        {
          validators: [
            GovukValidators.required('Enter minimum number of expected voyages'),
            GovukValidators.min(301, 'The minimum number of expected voyages must be more than 300'),
          ],
        },
      ),
    });
  },
};

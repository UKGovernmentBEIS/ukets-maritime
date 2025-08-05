import { Provider } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

import { EmpVariationDetails } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empVariationQuery } from '@requests/common/emp/+state';
import { EmpVariationDetailsFormModel } from '@requests/common/emp/subtasks/variation-details/variation-details/variation-details.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import {
  EMP_VARIATION_NON_SIGNIFICANT_CHANGES_SELECT_OPTIONS,
  EMP_VARIATION_SIGNIFICANT_CHANGES_SELECT_OPTIONS,
} from '@shared/constants';

const changesRequiredValidator: ValidatorFn = (
  group: FormGroup<EmpVariationDetailsFormModel>,
): ValidationErrors | null => {
  if (group.value.significantChanges?.length > 0 || group?.value?.nonSignificantChanges?.length > 0) {
    return null;
  }
  return {
    emptyChanges: 'Select a significant or non-significant change',
  };
};

export const variationDetailsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (fb: FormBuilder, store: RequestTaskStore): FormGroup<EmpVariationDetailsFormModel> => {
    const details = store.select(empVariationQuery.selectEmpVariationDetails)();

    return fb.group<EmpVariationDetailsFormModel>(
      {
        reason: fb.control<EmpVariationDetails['reason'] | null>(details?.reason, {
          validators: [
            GovukValidators.required('Enter an explanation of the changes'),
            GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
          ],
        }),
        nonSignificantChanges: fb.control<EmpVariationDetails['changes'] | null>(
          details?.changes?.filter((change) =>
            EMP_VARIATION_NON_SIGNIFICANT_CHANGES_SELECT_OPTIONS.map((x) => x.value).includes(change),
          ) ?? [],
        ),
        significantChanges: fb.control<EmpVariationDetails['changes'] | null>(
          details?.changes?.filter((change) =>
            EMP_VARIATION_SIGNIFICANT_CHANGES_SELECT_OPTIONS.map((x) => x.value).includes(change),
          ) ?? [],
        ),
        otherSignificantChangeReason: fb.control<EmpVariationDetails['otherSignificantChangeReason'] | null>(
          details?.otherSignificantChangeReason,
          {
            validators: [
              GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
              GovukValidators.required('Enter an explanation of the changes'),
            ],
          },
        ),
        otherNonSignificantChangeReason: fb.control<EmpVariationDetails['otherNonSignificantChangeReason'] | null>(
          details?.otherNonSignificantChangeReason,
          {
            validators: [
              GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
              GovukValidators.required('Enter an explanation of the changes'),
            ],
          },
        ),
      },
      {
        validators: [changesRequiredValidator],
      },
    );
  },
};

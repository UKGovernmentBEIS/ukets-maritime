import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { DoeFeeDetails } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { doeSubmitQuery } from '@requests/tasks/doe-submit/+state';
import { todayOrFutureDateValidator } from '@shared/validators';

export const feeDetailsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (fb: FormBuilder, store: RequestTaskStore): FormGroup => {
    const feeDetails = store.select(doeSubmitQuery.selectFeeDetails)();
    const commonMessage = 'Enter a positive number up to 2 decimal places';

    return fb.group({
      totalBillableHours: fb.control<string>(feeDetails?.totalBillableHours ?? null, {
        validators: [
          GovukValidators.required('Enter the total billable hours'),
          GovukValidators.pattern(/^(?!0\.0{1,2}$)([1-9][0-9]*(\.[0-9]{1,2})?|0\.[0-9]{1,2})$/, commonMessage),
          GovukValidators.notNaN(commonMessage),
        ],
      }),
      hourlyRate: fb.control<string>(feeDetails?.hourlyRate ?? null, {
        validators: [
          GovukValidators.required('Enter the hourly rate'),
          GovukValidators.min(0, commonMessage),
          GovukValidators.pattern(/^(?!0\.0{1,2}$)([1-9][0-9]*(\.[0-9]{1,2})?|0\.[0-9]{1,2})$/, commonMessage),
          GovukValidators.notNaN(commonMessage),
        ],
      }),
      dueDate: fb.control<DoeFeeDetails['dueDate'] | Date>(feeDetails?.dueDate ? new Date(feeDetails?.dueDate) : null, {
        validators: [GovukValidators.required('Enter a date'), todayOrFutureDateValidator()],
      }),
      comments: fb.control<string>(feeDetails?.comments ?? null, {
        validators: [GovukValidators.maxLength(10000, 'Enter up to 10000 characters')],
      }),
    });
  },
};

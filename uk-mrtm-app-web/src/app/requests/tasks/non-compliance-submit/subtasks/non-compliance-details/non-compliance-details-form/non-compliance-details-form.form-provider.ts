import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { NonComplianceSubmitTaskPayload } from '@requests/common/non-compliance';
import { TASK_FORM } from '@requests/common/task-form.token';
import { nonComplianceSubmitQuery } from '@requests/tasks/non-compliance-submit/+state';
import { todayOrPastDateValidator } from '@shared/validators';

export const nonComplianceDetailsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const nonComplianceDetails = store.select(nonComplianceSubmitQuery.selectNonComplianceDetails)();

    return formBuilder.group({
      reason: formBuilder.control<NonComplianceSubmitTaskPayload['reason'] | null>(nonComplianceDetails?.reason, {
        validators: [GovukValidators.required('You must select a type')],
      }),
      complianceDate: formBuilder.control<NonComplianceSubmitTaskPayload['complianceDate'] | Date | null>(
        nonComplianceDetails?.complianceDate ? new Date(nonComplianceDetails?.complianceDate) : null,
        { validators: [todayOrPastDateValidator('The date must be today or in the past')] },
      ),
      nonComplianceDate: formBuilder.control<NonComplianceSubmitTaskPayload['nonComplianceDate'] | Date | null>(
        nonComplianceDetails?.nonComplianceDate ? new Date(nonComplianceDetails?.nonComplianceDate) : null,
        { validators: [todayOrPastDateValidator('The date must be today or in the past')] },
      ),
      comments: formBuilder.control<NonComplianceSubmitTaskPayload['comments']>(
        nonComplianceDetails?.comments ?? null,
        [GovukValidators.maxLength(10000, 'Enter up to 10000 characters')],
      ),
    });
  },
};

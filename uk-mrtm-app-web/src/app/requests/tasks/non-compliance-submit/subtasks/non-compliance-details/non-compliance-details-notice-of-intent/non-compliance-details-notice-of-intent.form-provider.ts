import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { NonComplianceSubmitTaskPayload } from '@requests/common/non-compliance';
import { TASK_FORM } from '@requests/common/task-form.token';
import { nonComplianceSubmitQuery } from '@requests/tasks/non-compliance-submit/+state';

export const nonComplianceDetailsNoticeOfIntentProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const nonComplianceDetails = store.select(nonComplianceSubmitQuery.selectNonComplianceDetails)();

    return formBuilder.group({
      noticeOfIntent: formBuilder.control<NonComplianceSubmitTaskPayload['noticeOfIntent'] | null>(
        nonComplianceDetails?.noticeOfIntent,
        { validators: [GovukValidators.required('Select yes or no')] },
      ),
    });
  },
};

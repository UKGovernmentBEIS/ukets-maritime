import { Provider } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';

import { TASK_FORM } from '@requests/common/task-form.token';
import { nonComplianceSubmitQuery } from '@requests/tasks/non-compliance-submit/+state';

export const nonComplianceDetailsSelectedRequestsProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const selectedRequests = store.select(nonComplianceSubmitQuery.selectNonComplianceDetails)()?.selectedRequests;

    return formBuilder.group({
      selectedRequests: formBuilder.array<FormControl<string>>(
        selectedRequests?.length ? selectedRequests.map((requestId) => new FormControl<string>(requestId)) : [],
        { updateOn: 'change' },
      ),
    });
  },
};

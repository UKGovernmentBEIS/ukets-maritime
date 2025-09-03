import { UntypedFormBuilder } from '@angular/forms';

import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { returnToOperatorForChangesQuery } from '@requests/tasks/aer-verification-submit/return-to-operator-for-changes/+state/return-to-operator-for-changes.selectors';
import { ReturnToOperatorForChangesStore } from '@requests/tasks/aer-verification-submit/return-to-operator-for-changes/+state/return-to-operator-for-changes.store';

export const returnToOperatorForChangesFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, ReturnToOperatorForChangesStore],
  useFactory: (fb: UntypedFormBuilder, store: ReturnToOperatorForChangesStore) => {
    const changesRequired = store.select(returnToOperatorForChangesQuery.selectChangesRequired)();

    return fb.group({
      changesRequired: fb.control(changesRequired ?? null, [
        GovukValidators.required('Enter the changes required'),
        GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
      ]),
    });
  },
};

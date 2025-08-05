import { Provider } from '@angular/core';
import { FormBuilder, UntypedFormBuilder } from '@angular/forms';

import { EmpControlActivities } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { empProcedureFormProviderFactory } from '@requests/common/emp/components';
import { TASK_FORM } from '@requests/common/task-form.token';

export const controlActivitiesDocumentationFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) =>
    empProcedureFormProviderFactory<Omit<EmpControlActivities, 'outsourcedActivities'>>(
      'documentation',
      fb,
      store,
      empCommonQuery.selectControlActivities,
    ),
};

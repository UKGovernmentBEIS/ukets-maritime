import { Provider } from '@angular/core';
import { FormBuilder, UntypedFormBuilder } from '@angular/forms';

import { EmpEmissionSources } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { empProcedureFormProviderFactory } from '@requests/common/emp/components';
import { TASK_FORM } from '@requests/common/task-form.token';

export const emissionSourcesCompletionFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) =>
    empProcedureFormProviderFactory<EmpEmissionSources>(
      'listCompletion',
      fb,
      store,
      empCommonQuery.selectEmissionSources,
    ),
};

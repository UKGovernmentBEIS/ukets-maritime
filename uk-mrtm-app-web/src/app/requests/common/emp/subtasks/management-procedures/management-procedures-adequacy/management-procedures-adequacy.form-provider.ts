import { UntypedFormBuilder } from '@angular/forms';

import { EmpManagementProcedures } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { empProcedureFormProviderFactory } from '@requests/common/emp/components';
import { TASK_FORM } from '@requests/common/task-form.token';

export const managementProceduresAdequacyFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) =>
    empProcedureFormProviderFactory<EmpManagementProcedures>(
      'regularCheckOfAdequacy',
      fb,
      store,
      empCommonQuery.selectManagementProcedures,
    ),
};

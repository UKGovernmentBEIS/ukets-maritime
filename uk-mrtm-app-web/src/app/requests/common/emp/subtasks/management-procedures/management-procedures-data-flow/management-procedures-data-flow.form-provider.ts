import { UntypedFormBuilder } from '@angular/forms';

import { EmpManagementProcedures } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { empProcedureFormWithFilesProviderFactory } from '@requests/common/emp/components';
import { TASK_FORM } from '@requests/common/task-form.token';
import { RequestTaskFileService } from '@shared/services';

export const managementProceduresDataFlowFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore, RequestTaskFileService],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) =>
    empProcedureFormWithFilesProviderFactory<EmpManagementProcedures>(
      'dataFlowActivities',
      fb,
      store,
      empCommonQuery.selectManagementProcedures,
    ),
};

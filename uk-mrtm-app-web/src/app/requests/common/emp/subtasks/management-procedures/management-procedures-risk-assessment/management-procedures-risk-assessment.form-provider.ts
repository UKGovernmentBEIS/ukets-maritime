import { UntypedFormBuilder } from '@angular/forms';

import { EmpManagementProcedures } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { empProcedureFormWithFilesProviderFactory } from '@requests/common/emp/components/emp-procedure-form-with-files';
import { TASK_FORM } from '@requests/common/task-form.token';

export const managementProceduresRiskAssessmentFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) =>
    empProcedureFormWithFilesProviderFactory<EmpManagementProcedures>(
      'riskAssessmentProcedures',
      fb,
      store,
      empCommonQuery.selectManagementProcedures,
    ),
};

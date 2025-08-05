import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';

import { EmpMonitoringReportingRole } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { TASK_FORM } from '@requests/common/task-form.token';

export const managementProceduresRolesFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (fb: UntypedFormBuilder, store: RequestTaskStore) => {
    const roles = store.select(empCommonQuery.selectManagementProcedures)()?.monitoringReportingRoles;

    return fb.group(
      {
        monitoringReportingRoles: fb.array(
          roles?.length > 0 ? roles.map((role) => createRoleGroup(role)) : [createRoleGroup()],
        ),
      },
      { updateOn: 'change' },
    );
  },
};

export const createRoleGroup = (role?: EmpMonitoringReportingRole): FormGroup => {
  return new FormGroup(
    {
      jobTitle: new FormControl(role?.jobTitle ?? null, [
        GovukValidators.required('Enter a job title'),
        GovukValidators.maxLength(50, 'Enter up to 50 characters'),
      ]),
      mainDuties: new FormControl(role?.mainDuties ?? null, [
        GovukValidators.required('Enter the main duties of the role'),
        GovukValidators.maxLength(500, 'Enter up to 500 characters'),
      ]),
    },
    { updateOn: 'change' },
  );
};

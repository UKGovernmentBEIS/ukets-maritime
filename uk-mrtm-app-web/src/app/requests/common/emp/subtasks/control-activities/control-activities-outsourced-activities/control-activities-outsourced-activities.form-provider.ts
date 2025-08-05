import { Provider } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { getEmpProcedureFormGroup } from '@requests/common/emp/components';
import { TASK_FORM } from '@requests/common/task-form.token';

export const controlActivitiesOutsourcedActivitiesFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: UntypedFormBuilder, store: RequestTaskStore): UntypedFormGroup => {
    const outsourcedActivities = store.select(empCommonQuery.selectControlActivities)()?.outsourcedActivities;

    const formGroup = formBuilder.group({
      exist: formBuilder.control(outsourcedActivities?.exist ?? null, {
        validators: [GovukValidators.required('Select ‘Yes’, if you want to define outsourced activities')],
      }),
    });

    if (outsourcedActivities?.exist === true) {
      formGroup.addControl('details', formBuilder.group(getEmpProcedureFormGroup(outsourcedActivities?.details)));
    }

    return formGroup;
  },
};

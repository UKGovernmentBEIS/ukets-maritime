import { Provider } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { getEmpProcedureFormGroup } from '@requests/common/emp/components';
import { TASK_FORM } from '@requests/common/task-form.token';

export const emissionSourcesFactorsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: UntypedFormBuilder, store: RequestTaskStore): UntypedFormGroup => {
    const emissionFactors = store.select(empCommonQuery.selectEmissionSources)()?.emissionFactors;

    const formGroup = formBuilder.group({
      exist: formBuilder.control(emissionFactors?.exist ?? null, {
        validators: [GovukValidators.required('Select if you are using default values for all emissions factors')],
      }),
    });

    if (emissionFactors?.exist === false) {
      formGroup.addControl('factors', formBuilder.group(getEmpProcedureFormGroup(emissionFactors?.factors)));
    }

    return formGroup;
  },
};

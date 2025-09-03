import { Provider } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { getEmpProcedureFormGroup } from '@requests/common/emp/components';
import { TASK_FORM } from '@requests/common/task-form.token';

export const emissionSourcesComplianceFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: UntypedFormBuilder, store: RequestTaskStore): UntypedFormGroup => {
    const emissionCompliance = store.select(empCommonQuery.selectEmissionSources)()?.emissionCompliance;

    const formGroup = formBuilder.group({
      exist: formBuilder.control(emissionCompliance?.exist ?? null, {
        validators: [
          GovukValidators.required(
            'Select if you will be making an emissions reduction claim as a result of the purchase and delivery of eligible fuel',
          ),
        ],
      }),
    });

    if (emissionCompliance?.exist === true) {
      formGroup.addControl('criteria', formBuilder.group(getEmpProcedureFormGroup(emissionCompliance?.criteria)));
    }

    return formGroup;
  },
};

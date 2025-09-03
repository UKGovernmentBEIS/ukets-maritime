import { Provider } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import {
  MandateResponsibilityDeclarationFormGroupType,
  MandateResponsibilityDeclarationFormType,
} from '@requests/common/emp/subtasks/mandate/mandate-responsibility-declaration/mandate-responsibility-declaration.types';
import { TASK_FORM } from '@requests/common/task-form.token';

export const provideMandateResponsibilityDeclarationFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (
    formBuilder: FormBuilder,
    store: RequestTaskStore,
  ): FormGroup<MandateResponsibilityDeclarationFormGroupType> => {
    const mandate = store.select(empCommonQuery.selectMandate)();
    return formBuilder.group({
      responsibilityDeclaration: formBuilder.control<Array<
        MandateResponsibilityDeclarationFormType['responsibilityDeclaration']
      > | null>(mandate?.responsibilityDeclaration ? [mandate.responsibilityDeclaration] : null, {
        validators: [GovukValidators.required('Select the declaration note')],
      }),
    });
  },
};

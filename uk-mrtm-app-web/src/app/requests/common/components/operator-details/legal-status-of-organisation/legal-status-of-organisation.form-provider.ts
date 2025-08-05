import { inject, Provider } from '@angular/core';
import { FormBuilder, UntypedFormBuilder } from '@angular/forms';

import { OrganisationStructure } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY } from '@requests/+state';
import { TASK_FORM } from '@requests/common/task-form.token';

export const legalStatusOfOrganisationFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const commonSubtaskStepsQuery = inject(REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY);
    const operatorDetails = store.select(commonSubtaskStepsQuery.selectOperatorDetails)();

    return formBuilder.group({
      legalStatusType: formBuilder.control<OrganisationStructure['legalStatusType'] | null>(
        operatorDetails?.organisationStructure?.legalStatusType ?? null,
        { validators: [GovukValidators.required('Select legal status of your organisation')] },
      ),
    });
  },
};

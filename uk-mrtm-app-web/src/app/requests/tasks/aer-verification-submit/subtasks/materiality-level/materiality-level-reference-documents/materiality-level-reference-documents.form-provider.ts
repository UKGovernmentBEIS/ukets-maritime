import { Provider } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AerMaterialityLevel } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';
import { GovukValidators } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common/task-form.token';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

export const materialityLevelReferenceDocumentsFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder, RequestTaskStore],
  useFactory: (formBuilder: FormBuilder, store: RequestTaskStore) => {
    const materialityLevel = store.select(aerVerificationSubmitQuery.selectMaterialityLevel)();

    const accreditationReferenceDocumentTypes = formBuilder.control<
      AerMaterialityLevel['accreditationReferenceDocumentTypes']
    >(materialityLevel?.accreditationReferenceDocumentTypes, {
      updateOn: 'change',
      validators: [
        GovukValidators.required('Select the reference documents that are appropriate to the accreditation you hold'),
      ],
    });

    return formBuilder.group({
      accreditationReferenceDocumentTypes,
      otherReference: formBuilder.control<AerMaterialityLevel['otherReference']>(
        {
          value: materialityLevel?.otherReference ?? null,
          disabled: !accreditationReferenceDocumentTypes.value?.includes('OTHER'),
        },
        [
          GovukValidators.required('Enter reference details'),
          GovukValidators.maxLength(10000, 'Enter up to 10000 characters'),
        ],
      ),
    });
  },
};

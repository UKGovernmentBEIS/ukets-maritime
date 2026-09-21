import { Provider } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';

import { GovukValidators } from '@netz/govuk-components';

import { IMPORT_DATA_FORM_PROVIDER } from '@api-data-management/import-data';
import { ImportDataStore } from '@api-data-management/import-data/+state/import-data.store';
import { ImportDataState } from '@api-data-management/import-data/import-data.types';

export type ImportDataSelectTaskModel = Record<keyof Pick<ImportDataState, 'requestType'>, AbstractControl>;

export const provideImportDataSelectTaskForm: Provider = {
  provide: IMPORT_DATA_FORM_PROVIDER,
  deps: [FormBuilder, ImportDataStore],
  useFactory: (fb: FormBuilder, store: ImportDataStore) => {
    return fb.group<ImportDataSelectTaskModel>({
      requestType: fb.control<string | null>(
        store?.state?.requestType ? [store?.state?.requestType, store?.state?.year].filter(Boolean).join('|') : null,
        {
          validators: GovukValidators.required('Select a task to proceed'),
        },
      ),
    });
  },
};

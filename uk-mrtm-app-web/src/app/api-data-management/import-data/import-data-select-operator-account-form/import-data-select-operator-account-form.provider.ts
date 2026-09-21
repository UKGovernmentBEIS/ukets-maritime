import { Provider } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn } from '@angular/forms';

import { IMPORT_DATA_FORM_PROVIDER } from '@api-data-management/import-data';
import { ImportDataStore } from '@api-data-management/import-data/+state/import-data.store';
import { ImportDataState } from '@api-data-management/import-data/import-data.types';

export const validateSelectedAccounts: ValidatorFn = (control: AbstractControl): ValidationErrors => {
  return control?.value?.length ? null : { minArrayLength: 'Select at least one operator to import data' };
};

export const provideImportDataSelectOperatorAccountFormProvider: Provider = {
  provide: IMPORT_DATA_FORM_PROVIDER,
  deps: [FormBuilder, ImportDataStore],
  useFactory: (fb: FormBuilder, store: ImportDataStore) => {
    return fb.group({
      items: fb.control<ImportDataState['items'] | null>(store.state.items ?? null, {
        validators: validateSelectedAccounts,
      }),
    });
  },
};

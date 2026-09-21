import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { ImportDataStore } from '@api-data-management/import-data/+state/import-data.store';
import { IMPORT_DATA_FORM_PROVIDER } from '@api-data-management/import-data/import-data.constants';
import {
  provideImportDataSelectOperatorAccountFormProvider,
  validateSelectedAccounts,
} from '@api-data-management/import-data/import-data-select-operator-account-form/import-data-select-operator-account-form.provider';

describe('validateSelectedAccounts', () => {
  it('should pass when at least one account is selected', () => {
    expect(validateSelectedAccounts({ value: [1] } as any)).toBeNull();
  });

  it('should fail when the selection is empty', () => {
    expect(validateSelectedAccounts({ value: [] } as any)).toEqual({
      minArrayLength: 'Select at least one operator to import data',
    });
  });

  it('should fail when there is no value', () => {
    expect(validateSelectedAccounts({ value: null } as any)).toEqual({
      minArrayLength: 'Select at least one operator to import data',
    });
  });
});

describe('provideImportDataSelectOperatorAccountFormProvider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FormBuilder, provideImportDataSelectOperatorAccountFormProvider] });
  });

  it('should default the items control to null and be invalid when nothing is stored', () => {
    const formGroup = TestBed.inject(IMPORT_DATA_FORM_PROVIDER);

    expect(formGroup.value).toEqual({ items: null });
    expect(formGroup.valid).toBe(false);
  });

  it('should seed the items control from the store when accounts were already selected', () => {
    const store = TestBed.inject(ImportDataStore);
    store.setState({ items: [1, 2, 3] });

    const formGroup = TestBed.inject(IMPORT_DATA_FORM_PROVIDER);

    expect(formGroup.value).toEqual({ items: [1, 2, 3] });
    expect(formGroup.valid).toBe(true);
  });
});

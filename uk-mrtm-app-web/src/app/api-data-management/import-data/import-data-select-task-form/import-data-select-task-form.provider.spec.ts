import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { ImportDataStore } from '@api-data-management/import-data/+state/import-data.store';
import { IMPORT_DATA_FORM_PROVIDER } from '@api-data-management/import-data/import-data.constants';
import { provideImportDataSelectTaskForm } from '@api-data-management/import-data/import-data-select-task-form/import-data-select-task-form.provider';

describe('provideImportDataSelectTaskForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FormBuilder, provideImportDataSelectTaskForm] });
  });

  it('should default to an empty, invalid requestType control when nothing is stored', () => {
    const formGroup = TestBed.inject(IMPORT_DATA_FORM_PROVIDER);

    expect(formGroup.value).toEqual({ requestType: null });
    expect(formGroup.valid).toBe(false);
  });

  it('should combine the stored request type and year into the initial control value', () => {
    const store = TestBed.inject(ImportDataStore);
    store.setState({ requestType: 'AER', year: 2025 });

    const formGroup = TestBed.inject(IMPORT_DATA_FORM_PROVIDER);

    expect(formGroup.value).toEqual({ requestType: 'AER|2025' });
    expect(formGroup.valid).toBe(true);
  });

  it('should become valid once a requestType is selected', () => {
    const formGroup = TestBed.inject(IMPORT_DATA_FORM_PROVIDER);

    formGroup.setValue({ requestType: 'AER|2025' });

    expect(formGroup.valid).toBe(true);
  });
});

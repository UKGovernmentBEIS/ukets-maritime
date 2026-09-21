import { TestBed } from '@angular/core/testing';

import { ImportDataStore } from '@api-data-management/import-data/+state/import-data.store';

describe('ImportDataStore', () => {
  let store: ImportDataStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(ImportDataStore);
  });

  it('should be created with an empty initial state', () => {
    expect(store).toBeTruthy();
    expect(store.state).toEqual({});
  });

  it('should update the state via setState', () => {
    store.setState({ requestType: 'AER', year: 2025 });
    expect(store.state).toEqual({ requestType: 'AER', year: 2025 });
  });

  it('should reset back to the empty initial state', () => {
    store.setState({ requestType: 'EMP_ISSUANCE' });
    store.reset();
    expect(store.state).toEqual({});
  });
});

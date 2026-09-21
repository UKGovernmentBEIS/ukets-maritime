import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ImportDataStore } from '@api-data-management/import-data/+state/import-data.store';
import { ImportDataSuccessComponent } from '@api-data-management/import-data/import-data-success/import-data-success.component';

describe('ImportDataSuccessComponent', () => {
  let component: ImportDataSuccessComponent;
  let fixture: ComponentFixture<ImportDataSuccessComponent>;
  let store: ImportDataStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportDataSuccessComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    store = TestBed.inject(ImportDataStore);
    store.setState({ requestType: 'AER', year: 2025, items: [1, 2, 3] });

    fixture = TestBed.createComponent(ImportDataSuccessComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the store state that was captured at construction time', () => {
    expect((component as any).data()).toEqual({ requestType: 'AER', year: 2025, items: [1, 2, 3] });
  });
});

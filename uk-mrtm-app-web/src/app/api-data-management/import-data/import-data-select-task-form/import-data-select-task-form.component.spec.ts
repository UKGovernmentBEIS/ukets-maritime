import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { ImportDataStore } from '@api-data-management/import-data/+state/import-data.store';
import { ImportDataSelectTaskFormComponent } from '@api-data-management/import-data/import-data-select-task-form/import-data-select-task-form.component';
import { ConfigStore } from '@core/config';

describe('ImportDataSelectTaskFormComponent', () => {
  let component: ImportDataSelectTaskFormComponent;
  let fixture: ComponentFixture<ImportDataSelectTaskFormComponent>;
  let store: ImportDataStore;
  let router: Router;
  let configStore: ConfigStore;

  const currentYear = new Date().getFullYear();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportDataSelectTaskFormComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    configStore = TestBed.inject(ConfigStore);
    configStore.setState({
      properties: { minYearOfFirstMrtmActivity: String(currentYear) },
    });

    store = TestBed.inject(ImportDataStore);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ImportDataSelectTaskFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose standard task options sorted alphabetically', () => {
    expect((component as any).availableTasks()).toEqual([
      { value: 'EMP_ISSUANCE', text: 'Apply for an emissions monitoring plan' },
      { value: 'EMP_VARIATION', text: 'Apply to vary the emissions monitoring plan' },
      { value: `AER|${currentYear}`, text: `Complete ${currentYear} emissions report` },
    ]);
  });

  it('should store the selected request type and year and navigate to the next step on submit', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const activatedRoute = TestBed.inject(ActivatedRoute);

    (component as any).formGroup.setValue({ requestType: `AER|${currentYear}` });
    (component as any).onSubmit();

    expect(store.state).toEqual({ requestType: 'AER', year: currentYear });
    expect(navigateSpy).toHaveBeenCalledWith(['../select-operation-accounts'], { relativeTo: activatedRoute });
  });

  it('should store no year when the selected task type has none', () => {
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    (component as any).formGroup.setValue({ requestType: 'EMP_ISSUANCE' });
    (component as any).onSubmit();

    expect(store.state).toEqual({ requestType: 'EMP_ISSUANCE', year: undefined });
  });
});

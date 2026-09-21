import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { ThirdPartyDataManagementAvailableToImportResponseDTO } from '@mrtm/api';

import { ImportDataStore } from '@api-data-management/import-data/+state/import-data.store';
import { ImportDataSelectOperatorAccountFormComponent } from '@api-data-management/import-data/import-data-select-operator-account-form/import-data-select-operator-account-form.component';

describe('ImportDataSelectOperatorAccountFormComponent', () => {
  let component: ImportDataSelectOperatorAccountFormComponent;
  let fixture: ComponentFixture<ImportDataSelectOperatorAccountFormComponent>;
  let httpMock: HttpTestingController;
  let store: ImportDataStore;
  let router: Router;

  const response: ThirdPartyDataManagementAvailableToImportResponseDTO = {
    totalItems: 4,
    items: [
      { id: 1, name: 'Operator 1' },
      { id: 2, name: 'Operator 2' },
      { id: 3, name: 'Operator 3' },
      { id: 4, name: 'Operator 4' },
    ],
  };

  const configureModule = async () => {
    await TestBed.configureTestingModule({
      imports: [ImportDataSelectOperatorAccountFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(ImportDataStore);
    router = TestBed.inject(Router);
  };

  const createComponent = () => {
    fixture = TestBed.createComponent(ImportDataSelectOperatorAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock.expectOne('/api/v1.0/third-party-data-management/available-to-import?page=0&size=10000').flush(response);
  };

  afterEach(() => {
    httpMock.verify();
  });

  describe('with no previously selected accounts', () => {
    beforeEach(async () => {
      await configureModule();
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should expose all fetched accounts, pre-selected', () => {
      const data = (component as any).data();

      expect(data).toHaveLength(4);
      expect(data[0]).toMatchObject({ id: 1, name: 'Operator 1', isSelected: true });
      expect(data.every((item: { isSelected: boolean }) => item.isSelected)).toBe(true);
    });

    it('should patch the form with all account ids once the response arrives', () => {
      expect((component as any).form.value.items).toEqual([1, 2, 3, 4]);
    });
  });

  describe('with previously selected accounts', () => {
    beforeEach(async () => {
      await configureModule();
      store.setState({ items: [2, 4] });
      createComponent();
    });

    it('should only mark the previously selected accounts as selected', () => {
      const data = (component as any).data();
      const selectedIds = data
        .filter((item: { isSelected: boolean }) => item.isSelected)
        .map((item: { id: number }) => item.id);

      expect(selectedIds).toEqual([2, 4]);
    });

    it('should patch the form with only the previously selected ids', () => {
      expect((component as any).form.value.items).toEqual([2, 4]);
    });
  });

  describe('selection and submission', () => {
    beforeEach(async () => {
      await configureModule();
      createComponent();
    });

    it('should update the form when the selection changes', () => {
      (component as any)
        .data()
        .forEach((item: { id: number; isSelected: boolean }, index: number) => (item.isSelected = index < 2));

      component.onAccountsSelectionChanged();

      expect((component as any).form.value.items).toEqual([1, 2]);
    });

    it('should store the selected accounts and navigate to the summary step on submit', () => {
      const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      const activatedRoute = TestBed.inject(ActivatedRoute);

      (component as any).onSubmit();

      expect(store.state.items).toEqual([1, 2, 3, 4]);
      expect(store.state.rawItems).toHaveLength(4);
      expect(navigateSpy).toHaveBeenCalledWith(['../'], { relativeTo: activatedRoute });
    });
  });
});

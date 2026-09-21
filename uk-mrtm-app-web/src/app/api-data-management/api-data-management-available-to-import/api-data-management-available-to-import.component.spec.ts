import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ThirdPartyDataManagementAvailableToImportResponseDTO } from '@mrtm/api';

import { ApiDataManagementAvailableToImportComponent } from '@api-data-management/api-data-management-available-to-import/api-data-management-available-to-import.component';

describe('ApiDataManagementAvailableToImportComponent', () => {
  let component: ApiDataManagementAvailableToImportComponent;
  let fixture: ComponentFixture<ApiDataManagementAvailableToImportComponent>;
  let httpMock: HttpTestingController;

  const response: ThirdPartyDataManagementAvailableToImportResponseDTO = {
    totalItems: 1,
    totalAccounts: 5,
    accountsEligibleForImport: 1,
    items: [
      {
        id: 1,
        accountId: 10,
        name: 'Test Operator',
        imoNumber: 'IMO1234567',
        receivedOn: '2025-01-01T00:00:00.000Z',
        providerName: 'THETIS MRV',
        itemType: { requestType: 'AER', year: 2025 },
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiDataManagementAvailableToImportComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ApiDataManagementAvailableToImportComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/v1.0/third-party-data-management/available-to-import?page=0&size=20').flush(response);

    expect(component).toBeTruthy();
  });

  it('should request the first page on init and expose the response', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('/api/v1.0/third-party-data-management/available-to-import?page=0&size=20');
    req.flush(response);

    expect(component.data()).toEqual(response);
  });

  it('should emit isImportAvailable(true) when accounts are eligible for import', () => {
    const emitted: Array<boolean> = [];
    component.isImportAvailable.subscribe((value) => emitted.push(value));
    fixture.detectChanges();

    httpMock.expectOne('/api/v1.0/third-party-data-management/available-to-import?page=0&size=20').flush(response);

    expect(emitted).toEqual([true]);
  });

  it('should emit isImportAvailable(false) when no accounts are eligible for import', () => {
    const emitted: Array<boolean> = [];
    component.isImportAvailable.subscribe((value) => emitted.push(value));
    fixture.detectChanges();

    httpMock
      .expectOne('/api/v1.0/third-party-data-management/available-to-import?page=0&size=20')
      .flush({ ...response, accountsEligibleForImport: 0 });

    expect(emitted).toEqual([false]);
  });

  it('should request the next page when changePage is called', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/v1.0/third-party-data-management/available-to-import?page=0&size=20').flush(response);

    (component as any).changePage(2);
    fixture.detectChanges();

    const req = httpMock.expectOne('/api/v1.0/third-party-data-management/available-to-import?page=1&size=20');
    req.flush({ ...response, items: [] });

    expect(component.page()).toBe(2);
  });

  it('should request sorted data and reset to the first page when onSort is called', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/v1.0/third-party-data-management/available-to-import?page=0&size=20').flush(response);

    (component as any).changePage(2);
    fixture.detectChanges();
    httpMock.expectOne('/api/v1.0/third-party-data-management/available-to-import?page=1&size=20').flush(response);

    (component as any).onSort({ column: 'itemType', direction: 'ascending' });
    fixture.detectChanges();

    const req = httpMock.expectOne(
      '/api/v1.0/third-party-data-management/available-to-import?page=0&size=20&sortBy=TASK&direction=ASC',
    );
    req.flush(response);

    expect(component.page()).toBe(1);
  });
});

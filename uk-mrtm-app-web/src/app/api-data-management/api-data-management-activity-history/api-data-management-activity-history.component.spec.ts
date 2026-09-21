import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  ThirdPartyDataManagementTransactionDetailsResponseDTO,
  ThirdPartyDataManagementTransactionsResponseDTO,
} from '@mrtm/api';

import { ApiDataManagementActivityHistoryComponent } from '@api-data-management/api-data-management-activity-history/api-data-management-activity-history.component';
import { utils, writeFileXLSX } from 'xlsx';

vi.mock('xlsx', () => ({
  utils: {
    aoa_to_sheet: vi.fn(() => ({})),
    book_new: vi.fn(() => ({})),
    book_append_sheet: vi.fn(),
  },
  writeFileXLSX: vi.fn(),
}));

describe('ApiDataManagementActivityHistoryComponent', () => {
  let component: ApiDataManagementActivityHistoryComponent;
  let fixture: ComponentFixture<ApiDataManagementActivityHistoryComponent>;
  let httpMock: HttpTestingController;

  const response: ThirdPartyDataManagementTransactionsResponseDTO = {
    stats: {
      totalImports: 2,
      totalCompletedImports: 1,
      totalCompletedWithFailuresImports: 0,
      totalFailedImports: 0,
      totalInProgressImports: 1,
    },
    items: [
      { id: 1, createdOn: '2025-01-01T00:00:00.000Z', submitterName: 'Jane Doe', status: 'COMPLETED' },
      { id: 2, createdOn: '2025-01-02T00:00:00.000Z', submitterName: 'John Doe', status: 'IN_PROGRESS' },
    ],
  };

  const detailsResponse: ThirdPartyDataManagementTransactionDetailsResponseDTO = {
    transaction: {
      id: 1,
      createdOn: '2025-01-01T00:00:00.000Z',
      submitterName: 'Jane Doe',
      status: 'COMPLETED_WITH_FAILURES',
      itemType: { requestType: 'EMP_ISSUANCE' },
    },
    jobs: [
      { operatorName: 'SEA JET 1', status: 'Completed' },
      { operatorName: 'SEA JET 2', status: 'Failed', failureReason: 'The requestor is not assigned to the account' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiDataManagementActivityHistoryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ApiDataManagementActivityHistoryComponent);
    component = fixture.componentInstance;
    vi.clearAllMocks();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/v1.0/third-party-data-management/transactions?page=0&size=20').flush(response);

    expect(component).toBeTruthy();
  });

  it('should request the first page on init and expose the response stats', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/v1.0/third-party-data-management/transactions?page=0&size=20').flush(response);

    expect(component.data()?.stats).toEqual(response.stats);
  });

  it('should mark completed transactions as downloadable but not in-progress ones', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/v1.0/third-party-data-management/transactions?page=0&size=20').flush(response);

    const items = component.data()?.items;
    expect(items?.[0]).toMatchObject({ id: 1, report: true });
    expect(items?.[1]).toMatchObject({ id: 2, report: false });
  });

  it('should request the next page when changePage is called', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/v1.0/third-party-data-management/transactions?page=0&size=20').flush(response);

    (component as any).changePage(2);
    fixture.detectChanges();

    const req = httpMock.expectOne('/api/v1.0/third-party-data-management/transactions?page=1&size=20');
    req.flush({ ...response, items: [] });

    expect(component.page()).toBe(2);
  });

  it('should request sorted transactions and reset to the first page when onSort is called', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/v1.0/third-party-data-management/transactions?page=0&size=20').flush(response);

    (component as any).changePage(2);
    fixture.detectChanges();
    httpMock.expectOne('/api/v1.0/third-party-data-management/transactions?page=1&size=20').flush(response);

    (component as any).onSort({ column: 'createdOn', direction: 'ascending' });
    fixture.detectChanges();

    const req = httpMock.expectOne('/api/v1.0/third-party-data-management/transactions?page=0&size=20&direction=ASC');
    req.flush(response);

    expect(component.page()).toBe(1);
  });

  it('should fetch the transaction details and export them as an XLSX report', () => {
    fixture.detectChanges();
    httpMock.expectOne('/api/v1.0/third-party-data-management/transactions?page=0&size=20').flush(response);

    (component as any).downloadReport(1);
    httpMock.expectOne('/api/v1.0/third-party-data-management/transaction-details/1').flush(detailsResponse);

    expect(utils.aoa_to_sheet).toHaveBeenCalledWith([
      ['Transaction ID', '1'],
      ['Transaction status', 'Completed with failures'],
      ['Executed timestamp', new DatePipe('en-GB').transform('2025-01-01T00:00:00.000Z', 'M/d/yy h:mm a')],
      ['Task type', 'Apply for an emissions monitoring plan'],
      [],
      ['Maritime Operator name', 'Transaction status', 'Failure reasons'],
      ['SEA JET 1', 'Completed', 'N/A'],
      ['SEA JET 2', 'Failed', 'The requestor is not assigned to the account'],
    ]);

    expect(utils.book_append_sheet).toHaveBeenCalledWith(expect.anything(), expect.anything(), 'Transaction 1');
    expect(writeFileXLSX).toHaveBeenCalledWith(expect.anything(), 'Bulk_import_transaction_1.xlsx');
  });
});

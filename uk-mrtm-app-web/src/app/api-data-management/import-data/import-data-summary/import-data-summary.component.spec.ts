import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';

import { ThirdPartyDataManagementAvailableToImportItem } from '@mrtm/api';

import { FeedbackBannerStore } from '@netz/common/components';

import { ImportDataStore } from '@api-data-management/import-data/+state/import-data.store';
import { ImportDataSummaryComponent } from '@api-data-management/import-data/import-data-summary/import-data-summary.component';

describe('ImportDataSummaryComponent', () => {
  let component: ImportDataSummaryComponent;
  let fixture: ComponentFixture<ImportDataSummaryComponent>;
  let httpMock: HttpTestingController;
  let store: ImportDataStore;
  let router: Router;

  const rawItems: Array<ThirdPartyDataManagementAvailableToImportItem> = Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
    accountId: index + 1,
    name: `Mock Operator ${index + 1}`,
  }));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportDataSummaryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    store = TestBed.inject(ImportDataStore);
    store.setState({ requestType: 'AER', year: 2025, items: [1, 2, 3], rawItems });

    fixture = TestBed.createComponent(ImportDataSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the first page of rows by default', () => {
    const rows = (component as any).rows();

    expect(rows).toHaveLength(20);
    expect(rows[0]).toEqual(rawItems[0]);
    expect(rows[19]).toEqual(rawItems[19]);
  });

  it('should expose the next page of rows when the page changes', () => {
    (component as any).onPageChange(2);
    const rows = (component as any).rows();

    expect(rows).toHaveLength(5);
    expect(rows[0]).toEqual(rawItems[20]);
  });

  it('should initiate the import and navigate to the success step when it succeeds', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const activatedRoute = TestBed.inject(ActivatedRoute);

    component.onSubmit();

    const req = httpMock.expectOne('/api/v1.0/third-party-data-management/import');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ items: [1, 2, 3], year: 2025, requestType: 'AER' });
    req.flush(null);

    expect(navigateSpy).toHaveBeenCalledWith(['success'], { relativeTo: activatedRoute });
  });

  it('should show a feedback banner and not navigate when the import fails', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const feedbackBannerStore = TestBed.inject(FeedbackBannerStore);
    const setInvalidFormSpy = vi.spyOn(feedbackBannerStore, 'setInvalidForm');

    component.onSubmit();

    const req = httpMock.expectOne('/api/v1.0/third-party-data-management/import');
    req.flush('error', { status: 500, statusText: 'Server Error' });

    expect(setInvalidFormSpy).toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});

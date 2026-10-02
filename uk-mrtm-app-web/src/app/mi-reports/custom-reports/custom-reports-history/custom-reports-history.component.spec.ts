import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';

import { MiReportsUserDefinedService } from '@mrtm/api';

import { ActivatedRouteStub, asyncData, BasePage, MockType } from '@netz/common/testing';

import { CustomReportsHistoryComponent } from '@mi-reports/custom-reports/custom-reports-history/custom-reports-history.component';

describe('CustomReportsHistoryComponent', () => {
  class Page extends BasePage<CustomReportsHistoryComponent> {
    get pagination() {
      return this.query('govuk-pagination');
    }

    get accordionHeaders() {
      return this.queryAll<HTMLElement>('.govuk-accordion__section-heading-text-focus').map((el) =>
        el.textContent.trim(),
      );
    }
  }

  let component: CustomReportsHistoryComponent;
  let fixture: ComponentFixture<CustomReportsHistoryComponent>;
  let page: Page;
  let service: MockType<MiReportsUserDefinedService>;

  const historyResult = {
    results: [
      {
        submissionDate: '2026-01-01T00:00:00.000Z',
        reasonForChange: 'A reason',
        submittedBy: 'A user',
        reportName: 'A report',
        categories: 'Category 1,Category 2',
        description: 'A description',
        queryDefinition: 'select 1',
      },
    ],
    total: 1,
  };

  const setup = async (params: Params = { id: '1' }, queryParams: Params = {}, result = historyResult) => {
    service = {
      getMiReportUserDefinedHistory: vi.fn().mockReturnValue(asyncData(result)),
    };

    await TestBed.configureTestingModule({
      imports: [CustomReportsHistoryComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub(params, queryParams) },
        { provide: MiReportsUserDefinedService, useValue: service },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomReportsHistoryComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  it('should create', async () => {
    await setup();

    expect(component).toBeTruthy();
  });

  it('should request the history for the id from the route params and the default page', async () => {
    await setup({ id: '42' });

    expect(service.getMiReportUserDefinedHistory).toHaveBeenCalledWith(42, 0, 10);
  });

  it('should request the page from the query params when present', async () => {
    await setup({ id: '1' }, { page: '3' });

    expect(service.getMiReportUserDefinedHistory).toHaveBeenCalledWith(1, 2, 10);
  });

  it('should expose the data returned by the service', async () => {
    await setup();

    expect((component as any).data()).toEqual(historyResult);
  });

  it('should render each history entry in an accordion item, splitting categories into a list', async () => {
    await setup();

    expect(page.accordionHeaders).toEqual(['1 Jan 2026, 12:00am']);
    expect(page.summariesContents).toEqual([
      'Reason for change',
      'A reason',
      'Changed by',
      'A user',
      'Report name',
      'A report',
      'Categories',
      'Category 1Category 2',
      'Description',
      'A description',
      'SQL Query',
      'Show SQL code select 1',
    ]);
    expect(page.listContents).toEqual(['Category 1', 'Category 2']);
  });

  it('should not render pagination when the total does not exceed the page size', async () => {
    await setup();

    expect(page.pagination).toBeNull();
  });

  it('should render pagination and update currentPage when the total exceeds the page size', async () => {
    await setup({ id: '1' }, {}, { ...historyResult, total: 25 });

    expect(page.pagination).not.toBeNull();

    (component as any).currentPage.set(2);

    expect((component as any).currentPage()).toBe(2);
  });
});

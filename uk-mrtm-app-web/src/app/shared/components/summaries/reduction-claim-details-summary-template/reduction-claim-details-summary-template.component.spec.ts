import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { ReductionClaimDetailsSummaryTemplateComponent } from '@shared/components/summaries/reduction-claim-details-summary-template';
import { ReductionClaimDetailsListItemDto } from '@shared/types';

describe('ReductionClaimDetailsSummaryTemplateComponent', () => {
  class Page extends BasePage<ReductionClaimDetailsSummaryTemplateComponent> {
    get tableColumnContents(): string[] {
      return this.queryAll<HTMLTableCellElement>('thead th').map((th) => th.textContent.trim());
    }

    get tableRows(): HTMLTableRowElement[] {
      return this.queryAll<HTMLTableRowElement>('tbody tr');
    }

    get pagination(): HTMLElement {
      return this.query<HTMLElement>('govuk-pagination');
    }

    get summaryListContents(): string[] {
      return this.queryAll<HTMLElement>('dl dt, dl dd').map((el) => el.textContent.trim());
    }
  }

  const createFuelPurchases = (count: number): ReductionClaimDetailsListItemDto[] =>
    Array.from({ length: count }, (_, index) => ({
      batchNumber: `batch-${index + 1}`,
      smfMass: '1',
      co2EmissionFactor: '1',
      co2Emissions: '1',
    }));

  let component: ReductionClaimDetailsSummaryTemplateComponent;
  let fixture: ComponentFixture<ReductionClaimDetailsSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReductionClaimDetailsSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ReductionClaimDetailsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', []);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.tableColumnContents).toEqual([
      'Fuel name',
      'Batch number',
      'Mass of fuel',
      'CO2 EF t/t',
      'CO2 emissions (t)',
      'Supporting evidence',
      'Initial source',
    ]);
    expect(page.pagination).toBeFalsy();
    expect(page.summaryListContents).toEqual([]);
  });

  it('should not display total emissions when there are no fuel purchases', () => {
    fixture.componentRef.setInput('totalEmissions', '0');
    fixture.detectChanges();

    expect(page.summaryListContents).toEqual([]);
  });

  it('should paginate fuel purchases and display total emissions outside the table', async () => {
    fixture.componentRef.setInput('data', createFuelPurchases(12));
    fixture.componentRef.setInput('totalEmissions', '12');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(page.tableRows).toHaveLength(10);
    expect(page.pagination).toBeTruthy();
    expect(page.summaryListContents).toEqual(['Total CO2 emissions (t)', '12']);

    component.onPageChange(2);
    fixture.detectChanges();

    expect(page.tableRows).toHaveLength(2);
    expect(page.summaryListContents).toEqual(['Total CO2 emissions (t)', '12']);
  });

  it('should display all fuel purchases when pagination is disabled', async () => {
    fixture.componentRef.setInput('withPagination', false);
    fixture.componentRef.setInput('data', createFuelPurchases(12));
    fixture.componentRef.setInput('totalEmissions', '12');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(page.tableRows).toHaveLength(12);
    expect(page.pagination).toBeFalsy();
    expect(page.summaryListContents).toEqual(['Total CO2 emissions (t)', '12']);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { AerAggregatedDataEmissionsCalculationsSummaryTemplateComponent } from '@shared/components/summaries/aggregated-data/aer-aggregated-data-emissions-calculations-summary-template/aer-aggregated-data-emissions-calculations-summary-template.component';

describe('AerAggregatedDataEmissionsCalculationsSummaryTemplateComponent', () => {
  class Page extends BasePage<AerAggregatedDataEmissionsCalculationsSummaryTemplateComponent> {
    get heading4(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h4');
    }

    get tableColumnContents(): string[] {
      return this.queryAll<HTMLDListElement>('thead th').map((th) => th.textContent.trim());
    }
  }
  let component: AerAggregatedDataEmissionsCalculationsSummaryTemplateComponent;
  let fixture: ComponentFixture<AerAggregatedDataEmissionsCalculationsSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerAggregatedDataEmissionsCalculationsSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AerAggregatedDataEmissionsCalculationsSummaryTemplateComponent);
    fixture.componentRef.setInput('header', 'Test header');
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.heading4.textContent).toEqual('Test header');
    expect(page.tableColumnContents).toEqual([
      '',
      'CO2 emissions (t)',
      'CH4 emissions (tCO2e)',
      'N2O emissions (tCO2e)',
      'Total emissions (tCO2e)',
    ]);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { AerAggregatedDataShipEmissionsCalculatedTotalsComponent } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-ship-emissions-calculated/aer-aggregated-data-ship-emissions-calculated-totals/aer-aggregated-data-ship-emissions-calculated-totals.component';

describe('AerAggregatedDataShipEmissionsCalculatedTotalsComponent', () => {
  class Page extends BasePage<AerAggregatedDataShipEmissionsCalculatedTotalsComponent> {}
  let component: AerAggregatedDataShipEmissionsCalculatedTotalsComponent;
  let fixture: ComponentFixture<AerAggregatedDataShipEmissionsCalculatedTotalsComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerAggregatedDataShipEmissionsCalculatedTotalsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AerAggregatedDataShipEmissionsCalculatedTotalsComponent);
    fixture.componentRef.setInput('data', { totalShipEmissions: 123, surrenderEmissions: 123 });
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.heading3.textContent).toEqual('Total ship emissions');
    expect(page.summariesContents).toEqual([
      'Total ship emissions (tCO2e)',
      '123',
      'Emissions figure for surrender (tCO2e)',
      '123',
    ]);
  });
});

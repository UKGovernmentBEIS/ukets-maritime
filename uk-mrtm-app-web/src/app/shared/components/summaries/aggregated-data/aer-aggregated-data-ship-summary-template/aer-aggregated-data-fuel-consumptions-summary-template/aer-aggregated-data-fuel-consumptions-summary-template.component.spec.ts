import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { AerAggregatedDataFuelConsumptionsSummaryTemplateComponent } from '@shared/components/summaries/aggregated-data/aer-aggregated-data-ship-summary-template/aer-aggregated-data-fuel-consumptions-summary-template/aer-aggregated-data-fuel-consumptions-summary-template.component';

describe('AerAggregatedDataFuelConsumptionsSummaryTemplateComponent', () => {
  class Page extends BasePage<AerAggregatedDataFuelConsumptionsSummaryTemplateComponent> {}

  let component: AerAggregatedDataFuelConsumptionsSummaryTemplateComponent;
  let fixture: ComponentFixture<AerAggregatedDataFuelConsumptionsSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerAggregatedDataFuelConsumptionsSummaryTemplateComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(AerAggregatedDataFuelConsumptionsSummaryTemplateComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.componentRef.setInput('data', [
      {
        fuelOriginTypeName: {
          origin: 'RFNBO',
          uniqueIdentifier: '6c08df1e-2840-40ef-89ee-e29dbba916d3',
          type: 'E_DME',
        },
        totalConsumption: '123',
      },
    ]);
    fixture.componentRef.setInput('editable', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.heading3.textContent).toEqual('Total amount of each fuel type consumed');

    expect(page.summariesContents).toEqual([
      'Fuel type',
      'RFNBO e-fuels / e-DME',
      'Change',
      'Total consumption (tonnes)',
      '123',
      'Change',
    ]);

    fixture.componentRef.setInput('editable', false);
    fixture.detectChanges();

    expect(page.summariesContents).toEqual(['Fuel type', 'RFNBO e-fuels / e-DME', 'Total consumption (tonnes)', '123']);
  });
});

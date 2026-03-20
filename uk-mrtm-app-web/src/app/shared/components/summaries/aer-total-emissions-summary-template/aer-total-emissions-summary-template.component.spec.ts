import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { AerTotalEmissionsSummaryTemplateComponent } from '@shared/components/summaries/aer-total-emissions-summary-template/aer-total-emissions-summary-template.component';

describe('AerTotalEmissionsSummaryTemplateComponent', () => {
  class Page extends BasePage<AerTotalEmissionsSummaryTemplateComponent> {
    get totalEmissionsTableElement() {
      return this.query<HTMLTableElement>('table[aria-label="Emission calculations"]');
    }
  }

  let component: AerTotalEmissionsSummaryTemplateComponent;
  let fixture: ComponentFixture<AerTotalEmissionsSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerTotalEmissionsSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AerTotalEmissionsSummaryTemplateComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);

    fixture.componentRef.setInput('totalEmissions', {
      totalEmissions: {
        co2: '300.0000000',
        ch4: '300.0000000',
        n2o: '300.0000000',
        total: '900.0000000',
      },
      lessVoyagesInNorthernIrelandDeduction: {
        co2: '0.0000000',
        ch4: '250.0000000',
        n2o: '250.0000000',
        total: '500.0000000',
      },
      lessEmissionsReductionClaim: {
        co2: '0.0000000',
        ch4: '250.0000000',
        n2o: '250.0000000',
        total: '500.0000000',
      },
      totalShipEmissions: '500.0000000',
      surrenderEmissions: '300.0000000',
      totalShipEmissionsSummary: '500',
      surrenderEmissionsSummary: '300',
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.queryAll('h3').map((heading) => heading.textContent)).toEqual([
      'Emissions summary',
      'Emission calculations',
    ]);

    const tableElements = page.queryAll('table');
    expect(tableElements.length).toEqual(1);

    const totalEmissionsTable = page.query('table[aria-label="Emission calculations"]');
    expect(totalEmissionsTable).toBeTruthy();

    expect(
      Array.from(totalEmissionsTable.querySelectorAll('thead th').values())
        .map((el) => el.textContent.trim())
        .filter(Boolean),
    ).toEqual([
      'Emission type',
      'CO2 emissions (t)',
      'CH4 emissions (tCO2e)',
      'N2O emissions (tCO2e)',
      'Total emissions (tCO2e)',
    ]);
  });

  it('should display total emissions table', () => {
    expect(page.totalEmissionsTableElement).toBeTruthy();
    expect(
      Array.from(page.totalEmissionsTableElement.querySelectorAll('thead th'))
        .map((col) => col.textContent.trim())
        .filter(Boolean),
    ).toEqual([
      'Emission type',
      'CO2 emissions (t)',
      'CH4 emissions (tCO2e)',
      'N2O emissions (tCO2e)',
      'Total emissions (tCO2e)',
    ]);

    expect(
      Array.from(page.totalEmissionsTableElement.querySelectorAll('tbody tr td:first-child')).map((col) =>
        col.textContent.trim(),
      ),
    ).toEqual([
      'Total emissions from all ships',
      'Less emissions reduction claim',
      'Total maritime emissions',
      'Less Northern Ireland surrender deduction',
      'Emissions figure for surrender',
    ]);
  });
});

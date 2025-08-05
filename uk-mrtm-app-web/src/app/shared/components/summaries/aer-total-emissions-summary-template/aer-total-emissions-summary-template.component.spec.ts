import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { AerTotalEmissionsSummaryTemplateComponent } from '@shared/components/summaries/aer-total-emissions-summary-template/aer-total-emissions-summary-template.component';

describe('AerTotalEmissionsSummaryTemplateComponent', () => {
  class Page extends BasePage<AerTotalEmissionsSummaryTemplateComponent> {
    get totalEmissionsTableElement() {
      return this.query<HTMLTableElement>('table[aria-label="Total maritime emissions"]');
    }

    get emissionsFigureForSurrenderTableElement() {
      return this.query<HTMLTableElement>('table[aria-label="Emissions figure for surrender"]');
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
      lessCapturedCo2: {
        co2: '0.0000000',
        ch4: '300.0000000',
        n2o: '300.0000000',
        total: '600.0000000',
      },
      lessVoyagesNotInScope: {
        co2: '0.0000000',
        ch4: '250.0000000',
        n2o: '250.0000000',
        total: '500.0000000',
      },
      lessAnyERC: {
        co2: '0.0000000',
        ch4: '250.0000000',
        n2o: '250.0000000',
        total: '500.0000000',
      },
      lessIslandFerryDeduction: {
        co2: '0.0000000',
        ch4: '150.0000000',
        n2o: '150.0000000',
        total: '300.0000000',
      },
      less5PercentIceClassDeduction: {
        co2: '0.0000000',
        ch4: '150.0000000',
        n2o: '150.0000000',
        total: '300.0000000',
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

    expect(page.queryAll('h4').map((heading) => heading.textContent)).toEqual([
      'Total maritime emissions',
      'Emissions figure for surrender',
    ]);

    const tableElements = page.queryAll('table');
    expect(tableElements.length).toEqual(2);

    const totalEmissionsTable = page.query('table[aria-label="Total maritime emissions"]');
    expect(totalEmissionsTable).toBeInTheDocument();

    for (const tableElement of page.queryAll('table')) {
      expect(
        Array.from(tableElement.querySelectorAll('thead th').values())
          .map((el) => el.textContent.trim())
          .filter(Boolean),
      ).toEqual(['CO2 emissions (t)', 'CH4 emissions (tCO2e)', 'N2O emissions (tCO2e)', 'Total emissions (tCO2e)']);
    }
  });

  it('should display total emissions table', () => {
    expect(page.totalEmissionsTableElement).toBeInTheDocument();
    expect(
      Array.from(page.totalEmissionsTableElement.querySelectorAll('thead th'))
        .map((col) => col.textContent.trim())
        .filter(Boolean),
    ).toEqual(['CO2 emissions (t)', 'CH4 emissions (tCO2e)', 'N2O emissions (tCO2e)', 'Total emissions (tCO2e)']);

    expect(
      Array.from(page.totalEmissionsTableElement.querySelectorAll('tbody tr td:first-child')).map(
        (col) => col.textContent,
      ),
    ).toEqual([
      'Total emissions from all ships',
      'Less captured CO2',
      'Less voyages not in scope',
      'Less any ERC',
      'Total maritime emissions',
    ]);
  });

  it('should display emissions figure for surrender table', () => {
    expect(page.emissionsFigureForSurrenderTableElement).toBeInTheDocument();
    expect(
      Array.from(page.emissionsFigureForSurrenderTableElement.querySelectorAll('thead th'))
        .map((col) => col.textContent.trim())
        .filter(Boolean),
    ).toEqual(['CO2 emissions (t)', 'CH4 emissions (tCO2e)', 'N2O emissions (tCO2e)', 'Total emissions (tCO2e)']);

    expect(
      Array.from(page.emissionsFigureForSurrenderTableElement.querySelectorAll('tbody tr td:first-child')).map(
        (col) => col.textContent,
      ),
    ).toEqual(['Less small island ferry deduction', 'Less 5% ice class deduction', 'Emissions figure for surrender']);
  });
});

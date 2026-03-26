import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { CountryService } from '@core/services';
import { CountryServiceStub } from '@registration/testing/country-service-stub';
import { RegistryOrganisationStructureSummaryTemplateComponent } from '@shared/components/summaries/registry-organisation-structure-summary-template';

describe('RegistryOrganisationStructureSummaryTemplateComponent', () => {
  class Page extends BasePage<RegistryOrganisationStructureSummaryTemplateComponent> {}

  let component: RegistryOrganisationStructureSummaryTemplateComponent;
  let fixture: ComponentFixture<RegistryOrganisationStructureSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryOrganisationStructureSummaryTemplateComponent],
      providers: [{ provide: CountryService, useClass: CountryServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryOrganisationStructureSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', {
      legalStatusType: 'LIMITED_COMPANY',
      registeredAddress: {
        line1: 'Some address',
        city: 'London',
        country: 'CY',
        postcode: 'HY43 ST90',
        state: 'Cardiff',
      },
      registrationNumber: '11111111',
    });

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Organisation legal status',
      'Company',
      'Company registration number',
      '11111111',
      'Registered address',
      'Some addressLondonCardiffHY43 ST90Cyprus',
    ]);
  });
});

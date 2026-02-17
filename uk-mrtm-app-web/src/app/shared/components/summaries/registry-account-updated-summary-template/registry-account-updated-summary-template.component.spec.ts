import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { CountryService } from '@core/services';
import { CountryServiceStub } from '@registration/testing/country-service-stub';
import { RegistryAccountUpdatedSummaryTemplateComponent } from '@shared/components/summaries/registry-account-updated-summary-template/registry-account-updated-summary-template.component';

describe('RegistryAccountUpdatedSummaryTemplateComponent', () => {
  class Page extends BasePage<RegistryAccountUpdatedSummaryTemplateComponent> {}

  let component: RegistryAccountUpdatedSummaryTemplateComponent;
  let fixture: ComponentFixture<RegistryAccountUpdatedSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryAccountUpdatedSummaryTemplateComponent],
      providers: [{ provide: CountryService, useClass: CountryServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryAccountUpdatedSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', {
      accountDetails: {
        competentAuthority: 'ENGLAND',
        registryId: 1234567,
        firstYearOfVerifiedEmissions: 2024,
        monitoringPlanId: 'UK-E-MA-00066',
        accountName: 'feed',
        companyImoNumber: '2901476',
      },
      organisationStructure: {
        legalStatusType: 'LIMITED_COMPANY',
        registeredAddress: {
          line1: 'S Broadway Street',
          city: 'Mrazchester',
          country: 'CY',
          postcode: '4913980461595315',
          state: 'Nicosia',
        },
        sameAsContactAddress: false,
        registrationNumber: 'a',
      },
    });

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'UK ETS Registry ID',
      '1234567',
      'Emissions plan ID',
      'UK-E-MA-00066',
      'Company IMO number',
      '2901476',
      'First year of reporting obligation',
      '2024',
      'Regulator',
      'Environment Agency',
      'Organisation legal status',
      'Company',
      'Company registration number',
      'a',
      'Registered address',
      'S Broadway StreetMrazchesterNicosia4913980461595315Cyprus',
    ]);
  });
});

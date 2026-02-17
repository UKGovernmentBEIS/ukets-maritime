import { ComponentFixture, TestBed } from '@angular/core/testing';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { BasePage } from '@netz/common/testing';

import { CountryService } from '@core/services';
import { CountryServiceStub } from '@registration/testing/country-service-stub';
import { RegistryAccountUpdatedComponent } from '@requests/timeline/registry-account-updated/registry-account-updated.component';

describe('RegistryAccountUpdatedComponent', () => {
  class Page extends BasePage<RegistryAccountUpdatedComponent> {}

  let component: RegistryAccountUpdatedComponent;
  let fixture: ComponentFixture<RegistryAccountUpdatedComponent>;
  let page: Page;
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryAccountUpdatedComponent],
      providers: [{ provide: CountryService, useClass: CountryServiceStub }],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,

        id: 777,
        type: 'REGISTRY_UPDATED_ACCOUNT_EVENT_SUBMITTED',
        payload: {
          payloadType: 'REGISTRY_UPDATED_ACCOUNT_EVENT_SUBMITTED_PAYLOAD',
          accountDetails: {
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
        } as unknown,
        requestId: 'MAMP00066',
        requestType: 'EMP_ISSUANCE',
        requestAccountId: 66,
        competentAuthority: 'ENGLAND',
        creationDate: '2026-02-02T12:35:25.73785Z',
      },
    });

    fixture = TestBed.createComponent(RegistryAccountUpdatedComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements for empty data', () => {
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { EmpIssuanceSendRegistryAccountOpeningEventRequestActionPayload } from '@mrtm/api';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { CountryService } from '@core/services';
import { CountryServiceStub } from '@registration/testing/country-service-stub';
import { RegistrySubmittedComponent } from '@requests/timeline/registry-submitted/registry-submitted.component';

describe('RegistrySubmittedComponent', () => {
  let component: RegistrySubmittedComponent;
  let fixture: ComponentFixture<RegistrySubmittedComponent>;
  let page: Page;
  let store: RequestActionStore;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<RegistrySubmittedComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrySubmittedComponent],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: CountryService, useClass: CountryServiceStub },
      ],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        type: 'EMP_ISSUANCE_REGISTRY_ACCOUNT_OPENING_EVENT_SUBMITTED',
        submitter: 'Regulator england',
        payload: {
          payloadType: 'EMP_ISSUANCE_REGISTRY_ACCOUNT_OPENING_EVENT_SUBMITTED_PAYLOAD',
          businessId: 'MA00007',
          imoNumber: '1111117',
          name: 'OperatorAccount7',
          firstMaritimeActivityDate: '2026-01-01',
          competentAuthority: 'ENGLAND',
          organisationStructure: {
            legalStatusType: 'LIMITED_COMPANY',
            registeredAddress: {
              line1: 'Some address',
              city: 'London',
              country: 'CY',
              postcode: 'HY43 ST90',
              state: 'Cardiff',
            },
            registrationNumber: '11111111',
            evidenceFiles: ['41291b0a-d7fb-4e70-8485-f01c0a632212'],
          },
        } as EmpIssuanceSendRegistryAccountOpeningEventRequestActionPayload,
      },
    });

    fixture = TestBed.createComponent(RegistrySubmittedComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements for empty data', () => {
    expect(page.summariesContents).toEqual([
      'Emitter ID',
      'MA00007',
      'Company IMO Number',
      '1111117',
      'Operator name',
      'OperatorAccount7',
      'First year of reporting obligation',
      '1 Jan 2026',
      'Regulator',
      'Environment Agency',
      'Organisation legal status',
      'Company',
      'Company registration number',
      '11111111',
      'Registered address',
      'Some addressLondonCardiffHY43 ST90Cyprus',
    ]);
  });
});

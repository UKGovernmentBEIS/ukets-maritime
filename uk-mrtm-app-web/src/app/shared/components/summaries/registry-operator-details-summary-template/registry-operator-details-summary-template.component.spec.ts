import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { CountryService } from '@core/services';
import { CountryServiceStub } from '@registration/testing/country-service-stub';
import { RegistryOperatorDetailsSummaryTemplateComponent } from '@shared/components';

describe('RegistryOperatorDetailsSummaryTemplateComponent', () => {
  let component: RegistryOperatorDetailsSummaryTemplateComponent;
  let fixture: ComponentFixture<RegistryOperatorDetailsSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<RegistryOperatorDetailsSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryOperatorDetailsSummaryTemplateComponent],
      providers: [{ provide: CountryService, useClass: CountryServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistryOperatorDetailsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('operatorDetails', {
      operatorName: 'OperatorAccount7',
      imoNumber: '1111117',
      contactAddress: {
        line1: 'Some address',
        city: 'London',
        country: 'GB',
        postcode: '54639',
      },
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
      },
      activityDescription: 'asdf',
    });

    fixture.componentRef.setInput('account', {
      imoNumber: '1111117',
      name: 'OperatorAccount7',
      line1: 'Some address',
      city: 'London',
      country: 'GB',
      postcode: 'HY56 BS73',
      state: 'Cardiff',
      firstMaritimeActivityDate: '2026-01-01',
      id: 7,
      status: 'NEW',
      businessId: 'MA00007',
      competentAuthority: 'ENGLAND',
    });
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
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

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { OrganisationStructure } from '@mrtm/api';

import { BasePage } from '@netz/common/testing';

import { OperatorDetailsSummaryTemplateComponent } from '@shared/components';

describe('OperatorDetailsSummaryTemplateComponent', () => {
  let component: OperatorDetailsSummaryTemplateComponent;
  let fixture: ComponentFixture<OperatorDetailsSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<OperatorDetailsSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorDetailsSummaryTemplateComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(OperatorDetailsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('operatorDetails', {
      operatorName: 'OOperatorAccount13',
      imoNumber: '1333333',
      contactAddress: {
        line1: 'Some address 1',
        city: 'London',
        country: 'GB',
        postcode: 'GW R45 UT',
        state: 'Cardiff',
      },
      organisationStructure: {
        legalStatusType: 'LIMITED_COMPANY',
        registeredAddress: {
          line1: 'Some address 1',
          city: 'London',
          country: 'GB',
          postcode: '54U H86',
          state: 'Cardiff',
        },
        registrationNumber: '111111',
      } as OrganisationStructure,
      activityDescription: 'some activities',
    });
    fixture.componentRef.setInput('files', []);
    fixture.componentRef.setInput('wizardStep', {
      OPERATOR_DETAILS_OPERATOR_FORM: 'operator',
      OPERATOR_DETAILS_UNDERTAKEN_ACTIVITIES: 'undertaken-activities',
      OPERATOR_DETAILS_LEGAL_STATUS_OF_ORGANISATION: 'legal-status-of-organisation',
      OPERATOR_DETAILS_ORGANISATION_DETAILS: 'organisation-details',
    });

    fixture.componentRef.setInput('isEditable', true);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Company IMO Number',
      '1333333',
      'Operator name',
      'OOperatorAccount13',
      'Change operator name',
      'Contact address',
      'Some address 1Not providedLondonCardiffGW R45 UTNot provided',
      'Change contact address',
      'Description',
      'some activities',
      'Change description of activities carried out by the Maritime Operator',
      'Organisation legal status',
      'Company',
      'Change organisation legal status',
      'Company registration number',
      '111111',
      'Change  company registration number',
      'Registered address',
      'Some address 1Not providedLondonCardiff54U H86Not provided',
      'Change  registered address',
      'Upload proof of registered address',
      'Not provided',
      'Change upload proof of registered address',
    ]);
  });
});

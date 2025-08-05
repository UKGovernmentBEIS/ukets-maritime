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
    component.operatorDetails = {
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
      declarationDocuments: {
        exist: true,
        documents: [
          '041d0e61-ef94-45ea-8dba-2caea1d54771',
          '061f417c-6e6a-40d2-8203-422389579a03',
          '36a5cdcc-563e-4ec5-be73-33e312a3926e',
        ],
      },
      activityDescription: 'some activities',
    };
    component.files = [];
    component.declarationFiles = [
      { downloadUrl: '/tasks/1/file-download/11111111-1111-4111-a111-111111111111', fileName: '1.png' },
      { downloadUrl: '/tasks/1/file-download/22222222-2222-4222-a222-222222222222', fileName: '2.png' },
    ];
    component.wizardStep = {
      OPERATOR_DETAILS_OPERATOR_FORM: 'operator',
      OPERATOR_DETAILS_UNDERTAKEN_ACTIVITIES: 'undertaken-activities',
      OPERATOR_DETAILS_DECLARATION_DOCUMENTS: 'declaration-documents',
      OPERATOR_DETAILS_LEGAL_STATUS_OF_ORGANISATION: 'legal-status-of-organisation',
      OPERATOR_DETAILS_ORGANISATION_DETAILS: 'organisation-details',
    };

    component.isEditable = true;
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
      'Change',
      'Contact address',
      'Some address 1Not providedLondonCardiffGW R45 UTNot provided',
      'Change',
      'Description',
      'some activities',
      'Change',
      'Do you want to provide documents relating to Mandates or Declarations',
      'Yes',
      'Change',
      'Uploaded files',
      '1.png2.png',
      'Change',
      'Organisation legal status',
      'Company',
      'Change',
      'Company registration number',
      '111111',
      'Change',
      'Registered address',
      'Some address 1Not providedLondonCardiff54U H86Not provided',
      'Change',
      'Upload proof of registered address',
      'Not provided',
      'Change',
    ]);
  });
});

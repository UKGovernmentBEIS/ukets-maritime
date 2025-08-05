import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { ManagementProceduresSummaryTemplateComponent } from '@shared/components';

describe('ManagementProceduresSummaryTemplateComponent', () => {
  let component: ManagementProceduresSummaryTemplateComponent;
  let fixture: ComponentFixture<ManagementProceduresSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<ManagementProceduresSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementProceduresSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementProceduresSummaryTemplateComponent);
    component = fixture.componentInstance;
    component.managementProcedures = {
      monitoringReportingRoles: [
        {
          jobTitle: 'job 1',
          mainDuties: 'duty',
        },
      ],
      regularCheckOfAdequacy: {
        reference: 'adeq ref1',
        version: 'adeq ver1',
        description: 'adeq desc',
        responsiblePersonOrPosition: 'adeq prson',
        recordsLocation: 'adeq location',
        itSystemUsed: 'adeq it',
      },
      dataFlowActivities: {
        reference: 'dataflow ref',
        version: 'dataflow version',
        description: 'dataflow description',
        responsiblePersonOrPosition: 'dataflow prson',
        recordsLocation: 'dataflow location',
        itSystemUsed: 'dataflow it',
        files: [
          'f74f9b60-de3f-48dd-a431-915ce7112200',
          'b1a20580-02ea-4c16-90ae-58efdc22cab4',
          '841d7583-1312-4a2b-806c-550213fe76cb',
        ],
      },
      riskAssessmentProcedures: {
        reference: 'risk ref',
        version: 'risk ver',
        description: 'risk desc',
        responsiblePersonOrPosition: 'risk person',
        recordsLocation: 'risk loc',
        itSystemUsed: 'risk it',
        files: ['857bd34a-3c92-4317-9e41-77a31a5b5558', 'fcc4fe86-8c7c-4dce-ac8d-88d4cc8132e3'],
      },
    };
    component.managementProceduresMap = {
      title: 'Management procedures',
      monitoringReportingRoles: {
        title: 'Monitoring and reporting roles',
      },
      regularCheckOfAdequacy: {
        title: 'Regular check of the adequacy of the monitoring plan',
      },
      dataFlowActivities: {
        title: 'Procedures for data flow activities',
      },
      riskAssessmentProcedures: {
        title: 'Procedures for risk assessment',
      },
    };
    component.wizardStep = {
      MONITORING_REPORTING_ROLES: 'roles',
      REGULAR_CHECK_OF_ADEQUACY: 'adequacy',
      DATA_FLOW_ACTIVITIES: 'data-flow',
      RISK_ASSESSMENT_PROCEDURES: 'risk-assessment',
    };
    component.dataFlowFiles = [];
    component.riskAssessmentFiles = [
      { downloadUrl: '/tasks/1/file-download/11111111-1111-4111-a111-111111111111', fileName: '1.png' },
      { downloadUrl: '/tasks/1/file-download/22222222-2222-4222-a222-222222222222', fileName: '2.png' },
    ];

    component.isEditable = true;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Job title',
      'job 1',
      'Change',
      'Main duties',
      'duty',
      'Change',
      'Procedure reference',
      'adeq ref1',
      'Change',
      'Procedure version',
      'adeq ver1',
      'Change',
      'Description of procedure',
      'adeq desc',
      'Change',
      'Name of person or position responsible for this procedure',
      'adeq prson',
      'Change',
      'Location where records are kept',
      'adeq location',
      'Change',
      'Name of IT system used',
      'adeq it',
      'Change',
      'Procedure reference',
      'dataflow ref',
      'Change',
      'Procedure version',
      'dataflow version',
      'Change',
      'Description of procedure',
      'dataflow description',
      'Change',
      'Name of person or position responsible for this procedure',
      'dataflow prson',
      'Change',
      'Location where records are kept',
      'dataflow location',
      'Change',
      'Name of IT system used',
      'dataflow it',
      'Change',
      'Uploaded files',
      'Not provided',
      'Change',
      'Procedure reference',
      'risk ref',
      'Change',
      'Procedure version',
      'risk ver',
      'Change',
      'Description of procedure',
      'risk desc',
      'Change',
      'Name of person or position responsible for this procedure',
      'risk person',
      'Change',
      'Location where records are kept',
      'risk loc',
      'Change',
      'Name of IT system used',
      'risk it',
      'Change',
      'Uploaded files',
      '1.png2.png',
      'Change',
    ]);
  });
});

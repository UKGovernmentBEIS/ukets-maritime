import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { ManagementProceduresSummaryTemplateComponent } from '@shared/components';

const mockManagementProcedures = {
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

const mockManagementProceduresMap = {
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

const mockWizardStep = {
  MONITORING_REPORTING_ROLES: 'roles',
  REGULAR_CHECK_OF_ADEQUACY: 'adequacy',
  DATA_FLOW_ACTIVITIES: 'data-flow',
  RISK_ASSESSMENT_PROCEDURES: 'risk-assessment',
};

const mockDataFlowFiles = [];

const mockRiskAssessmentFiles = [
  { downloadUrl: '/tasks/1/file-download/11111111-1111-4111-a111-111111111111', fileName: '1.png' },
  { downloadUrl: '/tasks/1/file-download/22222222-2222-4222-a222-222222222222', fileName: '2.png' },
];

const mockIsEditable = true;

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
    fixture.componentRef.setInput('managementProcedures', mockManagementProcedures);
    fixture.componentRef.setInput('managementProceduresMap', mockManagementProceduresMap);
    fixture.componentRef.setInput('wizardStep', mockWizardStep);
    fixture.componentRef.setInput('dataFlowFiles', mockDataFlowFiles);
    fixture.componentRef.setInput('riskAssessmentFiles', mockRiskAssessmentFiles);
    fixture.componentRef.setInput('isEditable', mockIsEditable);
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
      'Change procedure reference (Regular check of the adequacy of the monitoring plan)',
      'Procedure version',
      'adeq ver1',
      'Change procedure version (Regular check of the adequacy of the monitoring plan)',
      'Description of procedure',
      'adeq desc',
      'Change description of procedure (Regular check of the adequacy of the monitoring plan)',
      'Name of person or position responsible for this procedure',
      'adeq prson',
      'Change  name of person or position responsible for this procedure (Regular check of the adequacy of the monitoring plan)',
      'Location where records are kept',
      'adeq location',
      'Change location where records are kept (Regular check of the adequacy of the monitoring plan)',
      'Name of IT system used',
      'adeq it',
      'Change name of IT system used (Regular check of the adequacy of the monitoring plan)',
      'Procedure reference',
      'dataflow ref',
      'Change procedure reference (Procedures for data flow activities)',
      'Procedure version',
      'dataflow version',
      'Change procedure version (Procedures for data flow activities)',
      'Description of procedure',
      'dataflow description',
      'Change description of procedure (Procedures for data flow activities)',
      'Name of person or position responsible for this procedure',
      'dataflow prson',
      'Change  name of person or position responsible for this procedure (Procedures for data flow activities)',
      'Location where records are kept',
      'dataflow location',
      'Change location where records are kept (Procedures for data flow activities)',
      'Name of IT system used',
      'dataflow it',
      'Change name of IT system used (Procedures for data flow activities)',
      'Uploaded files',
      'Not provided',
      'Change  uploaded files (Procedures for data flow activities)',
      'Procedure reference',
      'risk ref',
      'Change procedure reference (Procedures for risk assessment)',
      'Procedure version',
      'risk ver',
      'Change procedure version (Procedures for risk assessment)',
      'Description of procedure',
      'risk desc',
      'Change description of procedure (Procedures for risk assessment)',
      'Name of person or position responsible for this procedure',
      'risk person',
      'Change  name of person or position responsible for this procedure (Procedures for risk assessment)',
      'Location where records are kept',
      'risk loc',
      'Change location where records are kept (Procedures for risk assessment)',
      'Name of IT system used',
      'risk it',
      'Change name of IT system used (Procedures for risk assessment)',
      'Uploaded files',
      '1.png2.png',
      'Change  uploaded files (Procedures for risk assessment)',
    ]);
  });
});

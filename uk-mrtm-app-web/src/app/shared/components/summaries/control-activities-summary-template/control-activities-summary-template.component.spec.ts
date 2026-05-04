import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { ControlActivitiesSummaryTemplateComponent } from '@shared/components';

const mockControlActivities = {
  qualityAssurance: {
    reference: 'ca ref',
    version: 'ca ver',
    description: 'ca descr',
    responsiblePersonOrPosition: 'ca person',
    recordsLocation: 'ca loc',
    itSystemUsed: 'ca it',
  },
  internalReviews: {
    reference: 'ir ref',
    version: 'ir ver',
    description: 'ir desc',
    responsiblePersonOrPosition: 'ir person',
    recordsLocation: 'ir loc',
    itSystemUsed: 'ir it',
  },
  corrections: {
    reference: 'cc ref',
    version: 'cc ver',
    description: 'cc desc',
    responsiblePersonOrPosition: 'cc per',
    recordsLocation: 'cc loc',
    itSystemUsed: 'cc it',
  },
  outsourcedActivities: {
    exist: true,
    details: {
      reference: 'oa ref',
      version: 'oa ver',
      description: 'oa descr',
      responsiblePersonOrPosition: 'oa per',
      recordsLocation: 'oa loc',
    },
  },
  documentation: {
    reference: 'doc ref',
    version: 'doc ver',
    description: 'doc desc',
    responsiblePersonOrPosition: 'doc per',
    recordsLocation: 'doc loc',
  },
};

const mockControlActivitiesMap = {
  title: 'Control activities',
  qualityAssurance: {
    title: 'Quality assurance and reliability of information technology',
  },
  internalReviews: {
    title: 'Internal reviews and validation of data',
  },
  corrections: {
    title: 'Corrections and correctives actions',
  },
  documentation: {
    title: 'Documentation',
  },
  outsourcedActivities: {
    title: 'Outsourced Activities',
  },
};

const mockWizardStep = {
  QUALITY_ASSURANCE: 'quality-assurance',
  INTERNAL_REVIEWS: 'internal-reviews',
  CORRECTIONS: 'corrections-and-correctives',
  OUTSOURCED_ACTIVITIES: 'outsourced-activities',
  DOCUMENTATION: 'documentation',
  SUMMARY: '../',
};

const mockIsEditable = true;

describe('ControlActivitiesSummaryTemplateComponent', () => {
  let component: ControlActivitiesSummaryTemplateComponent;
  let fixture: ComponentFixture<ControlActivitiesSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<ControlActivitiesSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlActivitiesSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlActivitiesSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('controlActivities', mockControlActivities);
    fixture.componentRef.setInput('controlActivitiesMap', mockControlActivitiesMap);
    fixture.componentRef.setInput('wizardStep', mockWizardStep);
    fixture.componentRef.setInput('isEditable', mockIsEditable);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Procedure reference',
      'ca ref',
      'Change procedure reference (Quality assurance and reliability of information technology)',
      'Procedure version',
      'ca ver',
      'Change procedure version (Quality assurance and reliability of information technology)',
      'Description of procedure',
      'ca descr',
      'Change description of procedure (Quality assurance and reliability of information technology)',
      'Name of person or position responsible for this procedure',
      'ca person',
      'Change  name of person or position responsible for this procedure (Quality assurance and reliability of information technology)',
      'Location where records are kept',
      'ca loc',
      'Change location where records are kept (Quality assurance and reliability of information technology)',
      'Name of IT system used',
      'ca it',
      'Change name of IT system used (Quality assurance and reliability of information technology)',
      'Procedure reference',
      'ir ref',
      'Change procedure reference (Internal reviews and validation of data)',
      'Procedure version',
      'ir ver',
      'Change procedure version (Internal reviews and validation of data)',
      'Description of procedure',
      'ir desc',
      'Change description of procedure (Internal reviews and validation of data)',
      'Name of person or position responsible for this procedure',
      'ir person',
      'Change  name of person or position responsible for this procedure (Internal reviews and validation of data)',
      'Location where records are kept',
      'ir loc',
      'Change location where records are kept (Internal reviews and validation of data)',
      'Name of IT system used',
      'ir it',
      'Change name of IT system used (Internal reviews and validation of data)',
      'Procedure reference',
      'cc ref',
      'Change procedure reference (Corrections and correctives actions)',
      'Procedure version',
      'cc ver',
      'Change procedure version (Corrections and correctives actions)',
      'Description of procedure',
      'cc desc',
      'Change description of procedure (Corrections and correctives actions)',
      'Name of person or position responsible for this procedure',
      'cc per',
      'Change  name of person or position responsible for this procedure (Corrections and correctives actions)',
      'Location where records are kept',
      'cc loc',
      'Change location where records are kept (Corrections and correctives actions)',
      'Name of IT system used',
      'cc it',
      'Change name of IT system used (Corrections and correctives actions)',
      'Are any of your activities outsourced?',
      'Yes',
      'Change whether any of your activities are outsourced',
      'Procedure reference',
      'oa ref',
      'Change procedure reference (Outsourced Activities)',
      'Procedure version',
      'oa ver',
      'Change procedure version (Outsourced Activities)',
      'Description of procedure',
      'oa descr',
      'Change description of procedure (Outsourced Activities)',
      'Name of person or position responsible for this procedure',
      'oa per',
      'Change  name of person or position responsible for this procedure (Outsourced Activities)',
      'Location where records are kept',
      'oa loc',
      'Change location where records are kept (Outsourced Activities)',
      'Name of IT system used',
      'Not provided',
      'Change name of IT system used (Outsourced Activities)',
      'Procedure reference',
      'doc ref',
      'Change procedure reference (Documentation)',
      'Procedure version',
      'doc ver',
      'Change procedure version (Documentation)',
      'Description of procedure',
      'doc desc',
      'Change description of procedure (Documentation)',
      'Name of person or position responsible for this procedure',
      'doc per',
      'Change  name of person or position responsible for this procedure (Documentation)',
      'Location where records are kept',
      'doc loc',
      'Change location where records are kept (Documentation)',
      'Name of IT system used',
      'Not provided',
      'Change name of IT system used (Documentation)',
    ]);
  });
});

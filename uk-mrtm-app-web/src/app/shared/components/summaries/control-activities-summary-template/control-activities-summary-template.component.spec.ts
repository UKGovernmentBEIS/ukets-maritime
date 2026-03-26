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
      'Change',
      'Procedure version',
      'ca ver',
      'Change',
      'Description of procedure',
      'ca descr',
      'Change',
      'Name of person or position responsible for this procedure',
      'ca person',
      'Change',
      'Location where records are kept',
      'ca loc',
      'Change',
      'Name of IT system used',
      'ca it',
      'Change',
      'Procedure reference',
      'ir ref',
      'Change',
      'Procedure version',
      'ir ver',
      'Change',
      'Description of procedure',
      'ir desc',
      'Change',
      'Name of person or position responsible for this procedure',
      'ir person',
      'Change',
      'Location where records are kept',
      'ir loc',
      'Change',
      'Name of IT system used',
      'ir it',
      'Change',
      'Procedure reference',
      'cc ref',
      'Change',
      'Procedure version',
      'cc ver',
      'Change',
      'Description of procedure',
      'cc desc',
      'Change',
      'Name of person or position responsible for this procedure',
      'cc per',
      'Change',
      'Location where records are kept',
      'cc loc',
      'Change',
      'Name of IT system used',
      'cc it',
      'Change',
      'Are any of your activities outsourced?',
      'Yes',
      'Change',
      'Procedure reference',
      'oa ref',
      'Change',
      'Procedure version',
      'oa ver',
      'Change',
      'Description of procedure',
      'oa descr',
      'Change',
      'Name of person or position responsible for this procedure',
      'oa per',
      'Change',
      'Location where records are kept',
      'oa loc',
      'Change',
      'Name of IT system used',
      'Not provided',
      'Change',
      'Procedure reference',
      'doc ref',
      'Change',
      'Procedure version',
      'doc ver',
      'Change',
      'Description of procedure',
      'doc desc',
      'Change',
      'Name of person or position responsible for this procedure',
      'doc per',
      'Change',
      'Location where records are kept',
      'doc loc',
      'Change',
      'Name of IT system used',
      'Not provided',
      'Change',
    ]);
  });
});

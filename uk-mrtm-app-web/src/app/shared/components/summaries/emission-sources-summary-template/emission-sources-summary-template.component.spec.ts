import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { EmissionSourcesSummaryTemplateComponent } from '@shared/components';

describe('EmissionSourcesSummaryTemplateComponent', () => {
  let component: EmissionSourcesSummaryTemplateComponent;
  let fixture: ComponentFixture<EmissionSourcesSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<EmissionSourcesSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmissionSourcesSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmissionSourcesSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('emissionSources', {
      listCompletion: {
        reference: 'list completion ref',
        version: 'list completion  version',
        description: 'list completion  description',
        responsiblePersonOrPosition: 'list completion person',
        recordsLocation: 'list completion location',
        itSystemUsed: 'list completion it',
      },
      emissionFactors: {
        exist: false,
        factors: {
          reference: 'ef ref',
          version: 'ef ver',
          description: 'ef desc',
          responsiblePersonOrPosition: 'ef per',
          recordsLocation: 'ef loc',
          itSystemUsed: null,
        },
      },
      emissionCompliance: {
        exist: false,
      },
    });
    fixture.componentRef.setInput('emissionSourcesMap', {
      title: 'Procedures related to emissions sources and emissions factors',
      listCompletion: {
        title: 'Manage the completeness of the list of ships and emission sources',
      },
      emissionFactors: {
        title: 'Determination of emission factors',
      },
      emissionCompliance: {
        title: 'Emissions reduction claim',
        caption: 'Will you be making an emissions reduction claim relating to eligible fuels?',
      },
    });
    fixture.componentRef.setInput('wizardStep', {
      LIST_COMPLETION: 'completion',
      EMISSION_FACTORS: 'factors',
      EMISSION_COMPLIANCE: 'compliance',
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
      'Procedure reference',
      'list completion ref',
      'Change procedure reference (Manage the completeness of the list of ships and emission sources)',
      'Procedure version',
      'list completion  version',
      'Change procedure version (Manage the completeness of the list of ships and emission sources)',
      'Description of procedure',
      'list completion  description',
      'Change description of procedure (Manage the completeness of the list of ships and emission sources)',
      'Name of person or position responsible for this procedure',
      'list completion person',
      'Change  name of person or position responsible for this procedure (Manage the completeness of the list of ships and emission sources)',
      'Location where records are kept',
      'list completion location',
      'Change location where records are kept (Manage the completeness of the list of ships and emission sources)',
      'Name of IT system used',
      'list completion it',
      'Change name of IT system used (Manage the completeness of the list of ships and emission sources)',
      'Are you using default values for all emissions factors?',
      'No',
      'Change whether using default values for all emissions factors',
      'Procedure reference',
      'ef ref',
      'Change procedure reference (Determination of emission factors)',
      'Procedure version',
      'ef ver',
      'Change procedure version (Determination of emission factors)',
      'Description of procedure',
      'ef desc',
      'Change description of procedure (Determination of emission factors)',
      'Name of person or position responsible for this procedure',
      'ef per',
      'Change  name of person or position responsible for this procedure (Determination of emission factors)',
      'Location where records are kept',
      'ef loc',
      'Change location where records are kept (Determination of emission factors)',
      'Name of IT system used',
      'Not provided',
      'Change name of IT system used (Determination of emission factors)',
      'Will you be making an emissions reduction claim relating to eligible fuels?',
      'No',
      'Change emissions reduction claim relating to eligible fuels',
    ]);
  });
});

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
    component.emissionSources = {
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
    };
    component.emissionSourcesMap = {
      title: 'Procedures related to emissions sources and emissions factors',
      listCompletion: {
        title: 'Manage the completeness of the list of ships and emission sources',
      },
      emissionFactors: {
        title: 'Determination of emission factors',
      },
      emissionCompliance: {
        title: 'Compliance with sustainability criteria and greenhouse gas emission saving criteria',
      },
    };
    component.wizardStep = {
      LIST_COMPLETION: 'completion',
      EMISSION_FACTORS: 'factors',
      EMISSION_COMPLIANCE: 'compliance',
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
      'Procedure reference',
      'list completion ref',
      'Change',
      'Procedure version',
      'list completion  version',
      'Change',
      'Description of procedure',
      'list completion  description',
      'Change',
      'Name of person or position responsible for this procedure',
      'list completion person',
      'Change',
      'Location where records are kept',
      'list completion location',
      'Change',
      'Name of IT system used',
      'list completion it',
      'Change',
      'Are you using default values for all emissions factors?',
      'No',
      'Change',
      'Procedure reference',
      'ef ref',
      'Change',
      'Procedure version',
      'ef ver',
      'Change',
      'Description of procedure',
      'ef desc',
      'Change',
      'Name of person or position responsible for this procedure',
      'ef per',
      'Change',
      'Location where records are kept',
      'ef loc',
      'Change',
      'Name of IT system used',
      'Not provided',
      'Change',
      'Will you be making an emissions reduction claim as a result of the purchase and delivery of eligible fuel?',
      'No',
      'Change',
    ]);
  });
});

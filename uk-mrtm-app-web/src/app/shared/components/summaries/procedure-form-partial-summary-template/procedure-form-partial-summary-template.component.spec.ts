import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { ProcedureFormPartialSummaryTemplateComponent } from '@shared/components';

describe('ProcedureFormPartialSummaryTemplateComponent', () => {
  let component: ProcedureFormPartialSummaryTemplateComponent;
  let fixture: ComponentFixture<ProcedureFormPartialSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<ProcedureFormPartialSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcedureFormPartialSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcedureFormPartialSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('procedureForm', {
      reference: 'ca ref',
      version: 'ca ver',
      description: 'ca descr',
      responsiblePersonOrPosition: 'ca person',
      recordsLocation: 'ca loc',
      itSystemUsed: null,
    });
    fixture.componentRef.setInput('isEditable', true);
    fixture.componentRef.setInput('a11yActionsText', 'Determination of emission factors');
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
      'Change procedure reference (Determination of emission factors)',
      'Procedure version',
      'ca ver',
      'Change procedure version (Determination of emission factors)',
      'Description of procedure',
      'ca descr',
      'Change description of procedure (Determination of emission factors)',
      'Name of person or position responsible for this procedure',
      'ca person',
      'Change  name of person or position responsible for this procedure (Determination of emission factors)',
      'Location where records are kept',
      'ca loc',
      'Change location where records are kept (Determination of emission factors)',
      'Name of IT system used',
      'Not provided',
      'Change name of IT system used (Determination of emission factors)',
    ]);
  });
});

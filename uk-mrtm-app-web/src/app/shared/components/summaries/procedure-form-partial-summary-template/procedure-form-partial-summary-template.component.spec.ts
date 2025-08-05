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
    component.procedureForm = {
      reference: 'ca ref',
      version: 'ca ver',
      description: 'ca descr',
      responsiblePersonOrPosition: 'ca person',
      recordsLocation: 'ca loc',
      itSystemUsed: null,
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
      'Not provided',
      'Change',
    ]);
  });
});

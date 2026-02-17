import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { OverallDecisionSummaryTemplateComponent } from '@shared/components';

describe('OverallDecisionSummaryTemplateComponent', () => {
  let component: OverallDecisionSummaryTemplateComponent;
  let fixture: ComponentFixture<OverallDecisionSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<OverallDecisionSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverallDecisionSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(OverallDecisionSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('determination', {
      type: 'APPROVED',
      reason: 'Test',
    });
    fixture.componentRef.setInput('wizardStep', {
      OVERALL_DECISION_ACTIONS: 'actions',
      OVERALL_DECISION_QUESTION: 'question',
    });
    fixture.componentRef.setInput('isEditable', true);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual(['Decision', 'Approve', 'Change', 'Reason for decision', 'Test', 'Change']);
  });
});

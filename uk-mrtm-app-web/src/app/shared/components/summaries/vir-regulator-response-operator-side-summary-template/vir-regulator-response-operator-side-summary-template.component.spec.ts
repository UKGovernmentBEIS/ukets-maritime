import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { VirRegulatorResponseOperatorSideSummaryTemplateComponent } from '@shared/components/summaries/vir-regulator-response-operator-side-summary-template';

describe('VirRegulatorResponseOperatorSideSummaryTemplateComponent', () => {
  class Page extends BasePage<VirRegulatorResponseOperatorSideSummaryTemplateComponent> {}
  let component: VirRegulatorResponseOperatorSideSummaryTemplateComponent;
  let fixture: ComponentFixture<VirRegulatorResponseOperatorSideSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirRegulatorResponseOperatorSideSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VirRegulatorResponseOperatorSideSummaryTemplateComponent);
    fixture.componentRef.setInput('data', {
      improvementRequired: true,
      improvementDeadline: '2025-06-01',
      operatorActions: 'Test actions',
    });
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      "Regulator's decision",
      'Improvement is required',
      'Actions for the operator',
      'Test actions',
      'Deadline for improvement',
      '1 Jun 2025',
    ]);
  });
});

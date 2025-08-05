import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { VirRegulatorResponseSummaryTemplateComponent } from '@shared/components/summaries/vir-regulator-response-summary-template';

describe('VirRegulatorResponseSummaryTemplateComponent', () => {
  class Page extends BasePage<VirRegulatorResponseSummaryTemplateComponent> {}
  let component: VirRegulatorResponseSummaryTemplateComponent;
  let fixture: ComponentFixture<VirRegulatorResponseSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirRegulatorResponseSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VirRegulatorResponseSummaryTemplateComponent);
    fixture.componentRef.setInput('data', {
      improvementRequired: true,
      improvementDeadline: '2025-06-01',
      improvementComments: 'Test comment',
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
      'Is the improvement required?',
      'Yes',
      'Deadline for improvement to be completed',
      '1 Jun 2025',
      'Comments on the improvement',
      'Test comment',
      'Actions for the operator',
      'Test actions',
    ]);
  });
});

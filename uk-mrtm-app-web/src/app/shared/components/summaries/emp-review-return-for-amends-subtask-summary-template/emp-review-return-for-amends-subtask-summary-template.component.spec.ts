import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { EmpReviewReturnForAmendsSubtaskSummaryTemplateComponent } from '@shared/components/summaries/emp-review-return-for-amends-subtask-summary-template';

describe('EmpReviewReturnForAmendsSummaryTemplateComponent', () => {
  let component: EmpReviewReturnForAmendsSubtaskSummaryTemplateComponent;
  let fixture: ComponentFixture<EmpReviewReturnForAmendsSubtaskSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<EmpReviewReturnForAmendsSubtaskSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpReviewReturnForAmendsSubtaskSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpReviewReturnForAmendsSubtaskSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('reviewDecision', {
      type: 'ACCEPTED',
      details: {
        requiredChanges: [
          {
            reason: 'some required change 1',
            files: [
              { downloadUrl: '/tasks/1/file-download/11111111-1111-4111-a111-111111111111', fileName: '1.png' },
              { downloadUrl: '/tasks/1/file-download/22222222-2222-4222-a222-222222222222', fileName: '2.png' },
            ],
          },
          { reason: 'some required change 2', files: [] },
        ],
        notes: 'some notes',
      },
    });

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Changes required by operator',
      'some required change 1 1.png2.png some required change 2',
    ]);
  });
});

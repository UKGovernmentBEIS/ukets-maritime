import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { FollowUpReviewDecisionSummaryTemplateComponent } from '@shared/components';

describe('FollowUpReviewDecisionSummaryTemplateComponent', () => {
  let component: FollowUpReviewDecisionSummaryTemplateComponent;
  let fixture: ComponentFixture<FollowUpReviewDecisionSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<FollowUpReviewDecisionSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowUpReviewDecisionSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FollowUpReviewDecisionSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('followUpReviewDecision', {
      type: 'AMENDS_NEEDED',
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
      dueDate: '2027-01-01',
    });

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Decision',
      'Operator amends needed',
      'Changes required from operator',
      'some required change 1 1.png2.png some required change 2',
      'New due date for the response',
      '1 Jan 2027',
      'Notes',
      'some notes',
    ]);
  });
});

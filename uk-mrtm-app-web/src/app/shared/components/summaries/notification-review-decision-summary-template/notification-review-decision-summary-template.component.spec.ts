import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { NotificationReviewDecisionSummaryTemplateComponent } from '@shared/components';

describe('ReviewDecisionSummaryTemplateComponent', () => {
  let component: NotificationReviewDecisionSummaryTemplateComponent;
  let fixture: ComponentFixture<NotificationReviewDecisionSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<NotificationReviewDecisionSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationReviewDecisionSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationReviewDecisionSummaryTemplateComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('reviewDecision', {
      type: 'ACCEPTED',
      details: {
        notes: 'some notes',
        officialNotice: 'some summary',
        followUp: {
          followUpResponseRequired: true,
          followUpRequest: 'some coverage',
          followUpResponseExpirationDate: '2025-01-01',
        },
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
      'What is your decision for the information submitted?',
      'Accepted',
      'Do you require a response from the operator?',
      'Yes',
      'Explain what the operator should cover in their response',
      'some coverage',
      'Date response is needed',
      '1 Jan 2025',
      'Provide a summary of your decision to be included in the notification letter',
      'some summary',
      'Notes',
      'some notes',
    ]);
  });
});

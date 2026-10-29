import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { RequestFeedbackSentComponent } from '@feedback/request-feedback/request-feedback-sent/request-feedback-sent.component';

describe('RequestFeedbackSentComponent', () => {
  let fixture: ComponentFixture<RequestFeedbackSentComponent>;
  let page: BasePage<RequestFeedbackSentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestFeedbackSentComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestFeedbackSentComponent);
    page = new BasePage(fixture);
    fixture.detectChanges();
  });

  it('should display the confirmation', () => {
    expect(page.heading1.textContent.trim()).toEqual('Thank you for your feedback');
    expect(page.paragraph.textContent.trim()).toEqual(
      'Your responses have been submitted successfully. We review all feedback to help improve the service.',
    );
    expect(page.query<HTMLAnchorElement>('a').textContent).toEqual('Return to: Dashboard');
  });
});

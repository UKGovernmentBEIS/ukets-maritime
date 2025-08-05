import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackSentComponent } from '@feedback/feedback-sent/feedback-sent.component';

describe('FeedbackSentComponent', () => {
  let component: FeedbackSentComponent;
  let fixture: ComponentFixture<FeedbackSentComponent>;
  let hostElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackSentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackSentComponent);
    component = fixture.componentInstance;
    hostElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(hostElement.textContent).toContain('Feedback sent');
  });
});

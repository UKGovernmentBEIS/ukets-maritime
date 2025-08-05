import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpReviewActionButtonsComponent } from '@requests/tasks/notification-follow-up-review/components';

describe('FollowUpReviewActionButtonsComponent', () => {
  let component: FollowUpReviewActionButtonsComponent;
  let fixture: ComponentFixture<FollowUpReviewActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowUpReviewActionButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FollowUpReviewActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

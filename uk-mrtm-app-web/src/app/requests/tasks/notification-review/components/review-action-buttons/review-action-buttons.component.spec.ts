import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewActionButtonsComponent } from '@requests/tasks/notification-review/components/review-action-buttons/review-action-buttons.component';

describe('ReviewActionButtonsComponent', () => {
  let component: ReviewActionButtonsComponent;
  let fixture: ComponentFixture<ReviewActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewActionButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

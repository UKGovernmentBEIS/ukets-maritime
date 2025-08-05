import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AerReviewActionButtonsComponent } from '@requests/tasks/aer-review/components/aer-review-action-buttons';

describe('AerReviewActionButtonsComponent', () => {
  let component: AerReviewActionButtonsComponent;
  let fixture: ComponentFixture<AerReviewActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerReviewActionButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AerReviewActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

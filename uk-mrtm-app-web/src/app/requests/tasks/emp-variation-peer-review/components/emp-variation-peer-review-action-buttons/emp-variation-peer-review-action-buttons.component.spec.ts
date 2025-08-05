import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpPeerReviewActionButtonsComponent } from '@requests/tasks/emp-peer-review/components/emp-peer-review-action-buttons';

describe('EmpPeerReviewActionButtonsComponent', () => {
  let component: EmpPeerReviewActionButtonsComponent;
  let fixture: ComponentFixture<EmpPeerReviewActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpPeerReviewActionButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpPeerReviewActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

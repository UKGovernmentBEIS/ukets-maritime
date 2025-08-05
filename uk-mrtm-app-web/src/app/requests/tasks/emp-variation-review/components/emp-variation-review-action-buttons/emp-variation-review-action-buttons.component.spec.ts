import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpVariationReviewActionButtonsComponent } from '@requests/tasks/emp-variation-review/components';

describe('EmpVariationReviewActionButtonsComponent', () => {
  let component: EmpVariationReviewActionButtonsComponent;
  let fixture: ComponentFixture<EmpVariationReviewActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVariationReviewActionButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpVariationReviewActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

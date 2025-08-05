import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpReviewActionButtonsComponent } from '@requests/tasks/emp-review/components';

describe('EmpReviewActionButtonsComponent', () => {
  let component: EmpReviewActionButtonsComponent;
  let fixture: ComponentFixture<EmpReviewActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpReviewActionButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpReviewActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

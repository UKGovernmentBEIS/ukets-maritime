import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirReviewedDetailsComponent } from '@requests/timeline/vir-reviewed/vir-reviewed-details/vir-reviewed-details.component';

describe('VirReviewedDetailsComponent', () => {
  let component: VirReviewedDetailsComponent;
  let fixture: ComponentFixture<VirReviewedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirReviewedDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VirReviewedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

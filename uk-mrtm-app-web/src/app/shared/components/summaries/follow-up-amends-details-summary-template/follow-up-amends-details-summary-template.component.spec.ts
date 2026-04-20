import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpAmendsDetailsSummaryTemplateComponent } from '@shared/components/summaries/follow-up-amends-details-summary-template/follow-up-amends-details-summary-template.component';

describe('FollowUpAmendsDetailsSummaryTemplateComponent', () => {
  let component: FollowUpAmendsDetailsSummaryTemplateComponent;
  let fixture: ComponentFixture<FollowUpAmendsDetailsSummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowUpAmendsDetailsSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FollowUpAmendsDetailsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

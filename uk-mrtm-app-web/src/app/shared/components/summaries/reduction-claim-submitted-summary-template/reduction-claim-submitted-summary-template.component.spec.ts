import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReductionClaimSubmittedSummaryTemplateComponent } from '@shared/components/summaries/reduction-claim-submitted-summary-template/reduction-claim-submitted-summary-template.component';

describe('ReductionClaimSubmittedSummaryTemplateComponent', () => {
  let component: ReductionClaimSubmittedSummaryTemplateComponent;
  let fixture: ComponentFixture<ReductionClaimSubmittedSummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReductionClaimSubmittedSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReductionClaimSubmittedSummaryTemplateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariationRegulatorDecisionPartialSummaryTemplateComponent } from '@shared/components/summaries/variation-regulator-decision-partial-summary-template/variation-regulator-decision-partial-summary-template.component';

describe('VariationRegulatorDecisionPartialSummaryTemplateComponent', () => {
  let component: VariationRegulatorDecisionPartialSummaryTemplateComponent;
  let fixture: ComponentFixture<VariationRegulatorDecisionPartialSummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariationRegulatorDecisionPartialSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VariationRegulatorDecisionPartialSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

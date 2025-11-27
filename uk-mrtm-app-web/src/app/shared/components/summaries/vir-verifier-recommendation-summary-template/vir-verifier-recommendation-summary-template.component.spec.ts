import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { VirVerifierRecommendationSummaryTemplateComponent } from '@shared/components/summaries/vir-verifier-recommendation-summary-template';

describe('VirVerifierRecommendationSummaryTemplateComponent', () => {
  class Page extends BasePage<VirVerifierRecommendationSummaryTemplateComponent> {}
  let component: VirVerifierRecommendationSummaryTemplateComponent;
  let fixture: ComponentFixture<VirVerifierRecommendationSummaryTemplateComponent>;
  let page: Page;

  const mockData = {
    reference: 'B1',
    explanation: 'Explanation B1',
    materialEffect: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirVerifierRecommendationSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VirVerifierRecommendationSummaryTemplateComponent);
    fixture.componentRef.setInput('data', mockData);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements for UncorrectedItem', () => {
    expect(page.summariesContents).toEqual([
      'Item code',
      'B1 Uncorrected non-conformities from the previous year',
      "Verifier's recommendation",
      'Explanation B1',
      'Does this have a material effect on the total emissions reported?',
      'Yes',
    ]);
  });

  it('should display all HTML elements for VerifierComment', () => {
    const { materialEffect, ...rest } = mockData;

    fixture.componentRef.setInput('data', rest);
    fixture.detectChanges(true);

    expect(page.summariesContents).toEqual([
      'Item code',
      'B1 Uncorrected non-conformities from the previous year',
      "Verifier's recommendation",
      'Explanation B1',
    ]);
  });
});

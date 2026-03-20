import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { ReductionClaimDetailsSummaryTemplateComponent } from '@shared/components/summaries/reduction-claim-details-summary-template';

describe('ReductionClaimDetailsSummaryTemplateComponent', () => {
  class Page extends BasePage<ReductionClaimDetailsSummaryTemplateComponent> {
    get tableColumnContents(): string[] {
      return this.queryAll<HTMLDListElement>('thead th').map((th) => th.textContent.trim());
    }
  }

  let component: ReductionClaimDetailsSummaryTemplateComponent;
  let fixture: ComponentFixture<ReductionClaimDetailsSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReductionClaimDetailsSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReductionClaimDetailsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', []);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.tableColumnContents).toEqual([
      'Fuel name',
      'Batch number',
      'Mass of fuel',
      'CO2 EF t/t',
      'CO2 emissions (t)',
      'Supporting evidence',
      'Initial source',
    ]);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { ReductionClaimSummaryTemplateComponent } from '@shared/components/summaries/reduction-claim-summary-template/reduction-claim-summary-template.component';

describe('ReductionClaimSummaryTemplateComponent', () => {
  class Page extends BasePage<ReductionClaimSummaryTemplateComponent> {}
  let component: ReductionClaimSummaryTemplateComponent;
  let fixture: ComponentFixture<ReductionClaimSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReductionClaimSummaryTemplateComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReductionClaimSummaryTemplateComponent);
    fixture.componentRef.setInput('data', {});
    fixture.componentRef.setInput('header', 'Test heading');
    fixture.componentRef.setInput('wizardStep', { EXISTS: 'tmpStep' });

    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.heading2.textContent).toEqual('Test heading');
    expect(page.summariesContents).toEqual([
      'Will you be making an emissions reduction claim relating to eligible fuels?',
      'Not provided',
    ]);

    fixture.componentRef.setInput('data', { exist: true });
    fixture.componentRef.setInput('editable', true);
    fixture.detectChanges();
    expect(page.summariesContents).toEqual([
      'Will you be making an emissions reduction claim relating to eligible fuels?',
      'Yes',
      'Change emissions reduction claim for eligible fuels',
    ]);
  });
});

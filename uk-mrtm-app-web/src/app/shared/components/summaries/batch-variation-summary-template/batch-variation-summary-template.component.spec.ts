import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { BatchVariationSummaryTemplateComponent } from '@shared/components/summaries/batch-variation-summary-template';

describe('BatchVariationSummaryTemplateComponent', () => {
  class Page extends BasePage<BatchVariationSummaryTemplateComponent> {}
  let component: BatchVariationSummaryTemplateComponent;
  let fixture: ComponentFixture<BatchVariationSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchVariationSummaryTemplateComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchVariationSummaryTemplateComponent);
    fixture.componentRef.setInput('data', {
      reportingStatuses: ['Required to report'],
      summary: 'Lorem ipsum',
      signatory: 'Test regulator',
    });
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual(['Signatory', 'Test regulator', 'Summary of changes', 'Lorem ipsum']);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { VirRegulatorReportSummaryTemplateComponent } from '@shared/components/summaries/vir-regulator-report-summary-template/vir-regulator-report-summary-template.component';

describe('VirRegulatorReportSummaryTemplateComponent', () => {
  class Page extends BasePage<VirRegulatorReportSummaryTemplateComponent> {}
  let component: VirRegulatorReportSummaryTemplateComponent;
  let fixture: ComponentFixture<VirRegulatorReportSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirRegulatorReportSummaryTemplateComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteSnapshot(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VirRegulatorReportSummaryTemplateComponent);
    fixture.componentRef.setInput('data', { reportSummary: 'Test report summary' });
    fixture.componentRef.setInput('isEditable', true);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual(['Report summary', 'Test report summary', 'Change']);
  });
});

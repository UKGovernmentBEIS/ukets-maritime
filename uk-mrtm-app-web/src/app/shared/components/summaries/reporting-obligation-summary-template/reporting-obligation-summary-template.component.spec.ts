import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { mockAttachedFiles } from '@requests/common/aer/testing/mock-data';
import { ReportingObligationSummaryTemplateComponent } from '@shared/components';

const mockReportingObligationMap = {
  title: 'Reporting obligation',
  reportingRequired: {
    title: 'Are you required to submit an annual emissions report?',
  },
  noReportingReason: {
    title: 'Explain why you do not need to submit a report',
  },
  supportingDocuments: {
    title: 'Upload supporting documents (optional)',
  },
};

describe('ReportingObligationSummaryTemplateComponent', () => {
  let component: ReportingObligationSummaryTemplateComponent;
  let fixture: ComponentFixture<ReportingObligationSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<ReportingObligationSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportingObligationSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportingObligationSummaryTemplateComponent);
    component = fixture.componentInstance;
    setupDefaultInputs();
    page = new Page(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display full summary with change links when all inputs are provided', () => {
    fixture.componentRef.setInput('changeLink', 'link-path');
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Are you required to submit a 2025 emissions report?',
      'No',
      'Change',
      'Explain why you do not need to submit a report',
      'Lorem ipsum',
      'Change',
      'Upload supporting documents',
      'FileName1FileName2',
      'Change',
    ]);
  });

  it('should display "Not provided" when files array is empty', () => {
    fixture.componentRef.setInput('files', []);
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Are you required to submit a 2025 emissions report?',
      'No',
      'Explain why you do not need to submit a report',
      'Lorem ipsum',
      'Upload supporting documents',
      'Not provided',
    ]);
  });

  it('should display minimal content when reporting is required', () => {
    fixture.componentRef.setInput('reportingRequired', true);
    fixture.componentRef.setInput('reportingObligationDetails', undefined);
    fixture.detectChanges();

    expect(page.summariesContents).toEqual(['Are you required to submit a 2025 emissions report?', 'Yes']);
  });

  function setupDefaultInputs() {
    fixture.componentRef.setInput('reportingYear', '2025');
    fixture.componentRef.setInput('reportingRequired', false);
    fixture.componentRef.setInput('reportingObligationDetails', { noReportingReason: 'Lorem ipsum' });
    fixture.componentRef.setInput('files', mockAttachedFiles);
    fixture.componentRef.setInput('map', mockReportingObligationMap);
    fixture.componentRef.setInput('isEditable', true);
  }
});

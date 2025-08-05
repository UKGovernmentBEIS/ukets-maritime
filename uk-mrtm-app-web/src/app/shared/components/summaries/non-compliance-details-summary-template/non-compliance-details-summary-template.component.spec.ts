import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { mockNonComplianceDetailsSummary } from '@requests/common/non-compliance/testing';
import { NonComplianceDetailsSummaryTemplateComponent } from '@shared/components';

describe('NonComplianceDetailsSummaryTemplateComponent', () => {
  let component: NonComplianceDetailsSummaryTemplateComponent;
  let fixture: ComponentFixture<NonComplianceDetailsSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<NonComplianceDetailsSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceDetailsSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceDetailsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockNonComplianceDetailsSummary);
    fixture.componentRef.setInput('isEditable', true);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Type of non-compliance',
      'Failure to monitor emissions',
      'Change',
      'When did the operator become non-compliant?',
      '3 May 2025',
      'Change',
      'When did the operator become compliant?',
      '3 Jul 2025',
      'Change',
      'Comments',
      'Lorem ipsum',
      'Change',
      'Selected task or workflow',
      'MAMP00010 ApplicationMAV00010-2 VariationMAN00010-1 NotificationMAR00010-2024 2024 emissions report',
      'Change',
      'Have we decided to proceed with enforcement?',
      'Yes',
      'Change',
      'Do you want to proceed with a notice of intent?',
      'Yes',
      'Change',
      'Do you want to issue an initial penalty notice?',
      'Yes',
      'Change',
    ]);
  });

  it('should hide editing controls when not editable', () => {
    fixture.componentRef.setInput('isEditable', false);
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Type of non-compliance',
      'Failure to monitor emissions',
      'When did the operator become non-compliant?',
      '3 May 2025',
      'When did the operator become compliant?',
      '3 Jul 2025',
      'Comments',
      'Lorem ipsum',
      'Selected task or workflow',
      'MAMP00010 ApplicationMAV00010-2 VariationMAN00010-1 NotificationMAR00010-2024 2024 emissions report',
      'Have we decided to proceed with enforcement?',
      'Yes',
      'Do you want to proceed with a notice of intent?',
      'Yes',
      'Do you want to issue an initial penalty notice?',
      'Yes',
    ]);
  });
});

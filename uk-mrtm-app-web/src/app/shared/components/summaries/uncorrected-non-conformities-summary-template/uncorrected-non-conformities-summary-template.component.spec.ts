import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { UncorrectedNonConformitiesSummaryTemplateComponent } from '@shared/components';

describe('UncorrectedNonConformitiesSummaryTemplateComponent', () => {
  let component: UncorrectedNonConformitiesSummaryTemplateComponent;
  let fixture: ComponentFixture<UncorrectedNonConformitiesSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<UncorrectedNonConformitiesSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedNonConformitiesSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedNonConformitiesSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', {
      exist: true,
      uncorrectedNonConformities: [
        {
          reference: 'D1',
          explanation: 'Lorem ipsum 1',
          materialEffect: true,
        },
        {
          reference: 'D2',
          explanation: 'Lorem ipsum 2',
          materialEffect: false,
        },
      ],
      existPriorYearIssues: true,
      priorYearIssues: [
        {
          reference: 'E1',
          explanation: 'Lorem ipsum E1',
        },
        {
          reference: 'E2',
          explanation: 'Lorem ipsum E2',
        },
      ],
    });
    fixture.componentRef.setInput('isEditable', true);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Have there been any uncorrected non-conformities with the approved emissions monitoring plan?',
      'Yes',
      'Change  whether there have been any uncorrected non-conformities with the approved emissions monitoring plan',
      'Are there any non-conformities from the previous year that have not been resolved?',
      'Yes',
      'Change  whether there are any non-conformities from the previous year that have not been resolved',
    ]);
    expect(page.tableContents).toEqual([
      'Reference',
      'Explanation',
      'Impact',
      'Actions',
      'D1',
      'Lorem ipsum 1',
      'Material',
      'Change reference (D1) Remove reference (D1)',
      'D2',
      'Lorem ipsum 2',
      'Not material',
      'Change reference (D2) Remove reference (D2)',
      'Reference',
      'Explanation',
      'Actions',
      'E1',
      'Lorem ipsum E1',
      'Change reference (E1) Remove reference (E1)',
      'E2',
      'Lorem ipsum E2',
      'Change reference (E2) Remove reference (E2)',
    ]);
  });

  it('should hide editing controls when not editable', () => {
    fixture.componentRef.setInput('isEditable', false);
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Have there been any uncorrected non-conformities with the approved emissions monitoring plan?',
      'Yes',
      'Are there any non-conformities from the previous year that have not been resolved?',
      'Yes',
    ]);
    expect(page.tableContents).toEqual([
      'Reference',
      'Explanation',
      'Impact',
      'Actions',
      'D1',
      'Lorem ipsum 1',
      'Material',
      '',
      'D2',
      'Lorem ipsum 2',
      'Not material',
      '',
      'Reference',
      'Explanation',
      'Actions',
      'E1',
      'Lorem ipsum E1',
      '',
      'E2',
      'Lorem ipsum E2',
      '',
    ]);
  });

  it('should not show table when there are no non-conformities', () => {
    fixture.componentRef.setInput('data', {
      exist: false,
      existPriorYearIssues: false,
    });
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Have there been any uncorrected non-conformities with the approved emissions monitoring plan?',
      'No',
      'Change  whether there have been any uncorrected non-conformities with the approved emissions monitoring plan',
      'Are there any non-conformities from the previous year that have not been resolved?',
      'No',
      'Change  whether there are any non-conformities from the previous year that have not been resolved',
    ]);
    expect(page.tableContents).toEqual([]);
  });
});

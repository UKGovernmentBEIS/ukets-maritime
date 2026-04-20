import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { UncorrectedNonCompliancesSummaryTemplateComponent } from '@shared/components';

describe('UncorrectedNonCompliancesSummaryTemplateComponent', () => {
  let component: UncorrectedNonCompliancesSummaryTemplateComponent;
  let fixture: ComponentFixture<UncorrectedNonCompliancesSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<UncorrectedNonCompliancesSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedNonCompliancesSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedNonCompliancesSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', {
      exist: true,
      uncorrectedNonCompliances: [
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
      'Have there been any non-compliances with the maritime monitoring and reporting requirements in the UK ETS Order?',
      'Yes',
      'Change',
    ]);
    expect(page.tableContents).toEqual([
      'Reference',
      'Explanation',
      'Impact',
      '',
      'D1',
      'Lorem ipsum 1',
      'Material',
      'Change  Remove',
      'D2',
      'Lorem ipsum 2',
      'Not material',
      'Change  Remove',
    ]);
  });

  it('should hide editing controls when not editable', () => {
    fixture.componentRef.setInput('isEditable', false);
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Have there been any non-compliances with the maritime monitoring and reporting requirements in the UK ETS Order?',
      'Yes',
    ]);
    expect(page.tableContents).toEqual([
      'Reference',
      'Explanation',
      'Impact',
      '',
      'D1',
      'Lorem ipsum 1',
      'Material',
      '',
      'D2',
      'Lorem ipsum 2',
      'Not material',
      '',
    ]);
  });

  it('should not show table when there are no uncorrected non-compliances', () => {
    fixture.componentRef.setInput('data', {
      exist: false,
    });
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Have there been any non-compliances with the maritime monitoring and reporting requirements in the UK ETS Order?',
      'No',
      'Change',
    ]);
    expect(page.tableContents).toEqual([]);
  });
});

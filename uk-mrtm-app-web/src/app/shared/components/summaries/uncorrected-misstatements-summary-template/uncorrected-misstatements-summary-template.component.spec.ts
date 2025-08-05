import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { UncorrectedMisstatementsSummaryTemplateComponent } from '@shared/components';

describe('UncorrectedMisstatementsSummaryTemplateComponent', () => {
  let component: UncorrectedMisstatementsSummaryTemplateComponent;
  let fixture: ComponentFixture<UncorrectedMisstatementsSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<UncorrectedMisstatementsSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedMisstatementsSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedMisstatementsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', {
      exist: true,
      uncorrectedMisstatements: [
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
      'Are there any misstatements that were not corrected before issuing this report?',
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
      'Are there any misstatements that were not corrected before issuing this report?',
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

  it('should not show table when there are no misstatements', () => {
    fixture.componentRef.setInput('data', {
      exist: false,
    });
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Are there any misstatements that were not corrected before issuing this report?',
      'No',
      'Change',
    ]);
    expect(page.tableContents).toEqual([]);
  });
});

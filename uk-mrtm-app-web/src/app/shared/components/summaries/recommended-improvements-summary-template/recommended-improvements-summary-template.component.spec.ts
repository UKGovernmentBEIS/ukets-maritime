import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { RecommendedImprovementsSummaryTemplateComponent } from '@shared/components';

describe('RecommendedImprovementsSummaryTemplateComponent', () => {
  let component: RecommendedImprovementsSummaryTemplateComponent;
  let fixture: ComponentFixture<RecommendedImprovementsSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<RecommendedImprovementsSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedImprovementsSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendedImprovementsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', {
      exist: true,
      recommendedImprovements: [
        {
          reference: 'D1',
          explanation: 'Lorem ipsum 1',
        },
        {
          reference: 'D2',
          explanation: 'Lorem ipsum 2',
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
    expect(page.summariesContents).toEqual(['Are there any recommended improvements?', 'Yes', 'Change']);
    expect(page.tableContents).toEqual([
      'Reference',
      'Explanation',
      '',
      'D1',
      'Lorem ipsum 1',
      'Change  Remove',
      'D2',
      'Lorem ipsum 2',
      'Change  Remove',
    ]);
  });

  it('should hide editing controls when not editable', () => {
    fixture.componentRef.setInput('isEditable', false);
    fixture.detectChanges();

    expect(page.summariesContents).toEqual(['Are there any recommended improvements?', 'Yes']);
    expect(page.tableContents).toEqual([
      'Reference',
      'Explanation',
      '',
      'D1',
      'Lorem ipsum 1',
      '',
      'D2',
      'Lorem ipsum 2',
      '',
    ]);
  });

  it('should not show table when there are no recommended improvements', () => {
    fixture.componentRef.setInput('data', {
      exist: false,
    });
    fixture.detectChanges();

    expect(page.summariesContents).toEqual(['Are there any recommended improvements?', 'No', 'Change']);
    expect(page.tableContents).toEqual([]);
  });
});

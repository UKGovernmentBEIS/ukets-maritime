import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { RecommendedImprovementsListTemplateComponent } from '@shared/components';

describe('RecommendedImprovementsListTemplateComponent', () => {
  let component: RecommendedImprovementsListTemplateComponent;
  let fixture: ComponentFixture<RecommendedImprovementsListTemplateComponent>;
  let page: Page;

  class Page extends BasePage<RecommendedImprovementsListTemplateComponent> {
    get addAnotherItemButton(): HTMLDivElement {
      return this.query<HTMLDivElement>('[data-test-id="add-another-item-btn"]');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedImprovementsListTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendedImprovementsListTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', [
      {
        reference: 'D1',
        explanation: 'Lorem ipsum 1',
      },
      {
        reference: 'D2',
        explanation: 'Lorem ipsum 2',
      },
    ]);
    fixture.componentRef.setInput('isEditable', true);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.addAnotherItemButton).toBeTruthy();
    expect(page.tableContents).toEqual([
      'Reference',
      'Explanation',
      'Actions',
      'D1',
      'Lorem ipsum 1',
      'Change reference (D1) Remove reference (D1)',
      'D2',
      'Lorem ipsum 2',
      'Change reference (D2) Remove reference (D2)',
    ]);
  });

  it('should hide editing controls when not editable', () => {
    fixture.componentRef.setInput('isEditable', false);
    fixture.detectChanges();
    expect(page.addAnotherItemButton).toBeNull();
    expect(page.tableContents).toEqual([
      'Reference',
      'Explanation',
      'Actions',
      'D1',
      'Lorem ipsum 1',
      '',
      'D2',
      'Lorem ipsum 2',
      '',
    ]);
  });
});

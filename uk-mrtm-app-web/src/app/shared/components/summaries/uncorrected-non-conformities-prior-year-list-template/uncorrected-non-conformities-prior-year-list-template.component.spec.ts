import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { UncorrectedNonConformitiesPriorYearListTemplateComponent } from '@shared/components';

describe('UncorrectedNonConformitiesPriorYearListTemplateComponent', () => {
  let component: UncorrectedNonConformitiesPriorYearListTemplateComponent;
  let fixture: ComponentFixture<UncorrectedNonConformitiesPriorYearListTemplateComponent>;
  let page: Page;

  class Page extends BasePage<UncorrectedNonConformitiesPriorYearListTemplateComponent> {
    get addAnotherItemButton(): HTMLDivElement {
      return this.query<HTMLDivElement>('[data-test-id="add-another-item-btn"]');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedNonConformitiesPriorYearListTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedNonConformitiesPriorYearListTemplateComponent);
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
    expect(page.addAnotherItemButton).toBeNull();
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
});

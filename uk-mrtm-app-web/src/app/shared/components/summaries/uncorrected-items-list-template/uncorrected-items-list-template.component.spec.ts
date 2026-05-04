import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { UncorrectedItemsListTemplateComponent } from '@shared/components';

describe('UncorrectedItemsListTemplateComponent', () => {
  let component: UncorrectedItemsListTemplateComponent;
  let fixture: ComponentFixture<UncorrectedItemsListTemplateComponent>;
  let page: Page;

  class Page extends BasePage<UncorrectedItemsListTemplateComponent> {
    get addAnotherItemButton(): HTMLDivElement {
      return this.query<HTMLDivElement>('[data-test-id="add-another-item-btn"]');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedItemsListTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedItemsListTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', [
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
    ]);
    fixture.componentRef.setInput('description', 'Uncorrected Items Table Description');
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
    ]);
  });

  it('should hide editing controls when not editable', () => {
    fixture.componentRef.setInput('isEditable', false);
    fixture.detectChanges();
    expect(page.addAnotherItemButton).toBeNull();
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
    ]);
  });
});

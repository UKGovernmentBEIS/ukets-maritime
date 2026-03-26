import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { AbbreviationsSummaryTemplateComponent } from '@shared/components';

describe('AbbreviationsSummaryTemplateComponent', () => {
  let component: AbbreviationsSummaryTemplateComponent;
  let fixture: ComponentFixture<AbbreviationsSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<AbbreviationsSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbbreviationsSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AbbreviationsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('abbreviations', {
      exist: true,
      abbreviationDefinitions: [{ abbreviation: 'Abbreviation1', definition: 'definition 1' }],
    });
    fixture.componentRef.setInput('abbreviationsMap', {
      title: 'List of definitions and abbreviations',
      abbreviationsQuestion: {
        title: 'Are you using any abbreviations or terminology in your application which need explanation?',
      },
    });
    fixture.componentRef.setInput('wizardStep', { ABBREVIATIONS_QUESTION: 'abbreviations-question', SUMMARY: '../' });
    fixture.componentRef.setInput('isEditable', true);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Are you using any abbreviations or terminology in your application which need explanation?',
      'Yes',
      'Change',
      'Abbreviation, acronym or terminology',
      'Abbreviation1',
      'Change',
      'Definition',
      'definition 1',
      'Change',
    ]);
  });
});

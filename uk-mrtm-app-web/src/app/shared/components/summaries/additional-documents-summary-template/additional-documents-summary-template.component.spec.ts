import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { AdditionalDocumentsSummaryTemplateComponent } from '@shared/components';

describe('AdditionalDocumentsSummaryTemplateComponent', () => {
  let component: AdditionalDocumentsSummaryTemplateComponent;
  let fixture: ComponentFixture<AdditionalDocumentsSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<AdditionalDocumentsSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalDocumentsSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalDocumentsSummaryTemplateComponent);
    component = fixture.componentInstance;
    component.additionalDocuments = {
      exist: true,
      documents: ['11111111-1111-4111-a111-111111111111'],
    };
    component.additionalDocumentsMap = {
      title: 'Additional information',
      additionalDocumentsUpload: {
        title: 'Do you want to upload any additional documents or information to support your application?',
      },
    };
    component.files = [
      { downloadUrl: '/tasks/64/file-download/11111111-1111-4111-a111-111111111111', fileName: '1.png' },
    ];
    component.wizardStep = { ADDITIONAL_DOCUMENTS_UPLOAD: 'additional-documents-upload', SUMMARY: '../' };
    component.isEditable = true;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Do you want to upload any additional documents or information to support your application?',
      'Yes',
      'Change',
      'Uploaded files',
      '1.png',
      'Change',
    ]);
  });
});

import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { DocumentTemplatesService } from '@mrtm/api';

import { ActivatedRouteStub, BasePage, mockClass } from '@netz/common/testing';

import { DocumentTemplateComponent } from '@templates/document/edit/document-template.component';
import { mockedDocumentTemplate } from '@templates/testing/mock-data';

describe('DocumentTemplateComponent', () => {
  let component: DocumentTemplateComponent;
  let fixture: ComponentFixture<DocumentTemplateComponent>;
  let page: Page;
  let activatedRoute: ActivatedRouteStub;

  const documentTemplatesService = mockClass(DocumentTemplatesService);

  class Page extends BasePage<DocumentTemplateComponent> {
    get title() {
      return this.query<HTMLDivElement>('.govuk-heading-l');
    }

    get file() {
      return (
        this.query<HTMLSpanElement>('.moj-multi-file-upload__filename') ??
        this.query<HTMLSpanElement>('.moj-multi-file-upload__success')
      );
    }

    set fileValue(value: File) {
      this.setInputValue('input[type="file"]', value);
    }

    get deleteFileBtn() {
      return this.query<HTMLButtonElement>('button[type="button"]');
    }

    get errors() {
      return this.queryAll<HTMLAnchorElement>('.govuk-error-summary li a');
    }
  }

  beforeEach(async () => {
    activatedRoute = new ActivatedRouteStub(undefined, undefined, {
      documentTemplate: mockedDocumentTemplate,
    });
    documentTemplatesService.updateDocumentTemplate.mockReturnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [DocumentTemplateComponent],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: DocumentTemplatesService, useValue: documentTemplatesService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTemplateComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should succesfully upload and submit new document file', async () => {
    expect(page.title.textContent).toEqual(`Edit ${mockedDocumentTemplate.name}`);
    expect(page.file.textContent.trim()).toEqual(mockedDocumentTemplate.filename);

    page.deleteFileBtn.click();
    fixture.detectChanges();
    expect(page.file).toBeNull();

    page.submitButton.click();
    fixture.detectChanges();
    expect(page.errorSummary).toBeTruthy();
    expect(page.errors.map((error) => error.textContent.trim())).toEqual(['Select a file']);

    const filename = 'AnotherFile.docx';
    const file = new File(['file content'], filename);
    page.fileValue = file;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeFalsy();
    expect(documentTemplatesService.updateDocumentTemplate).toHaveBeenCalledTimes(1);
    expect(documentTemplatesService.updateDocumentTemplate).toHaveBeenCalledWith(mockedDocumentTemplate.id, file);
  });
});

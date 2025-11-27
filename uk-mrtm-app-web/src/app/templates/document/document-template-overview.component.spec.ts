import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { PageHeadingComponent } from '@netz/common/components';
import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { DocumentTemplateOverviewComponent } from '@templates/document/document-template-overview.component';
import { mockedDocumentTemplate } from '@templates/testing/templates-data.mock';

describe('DocumentTemplateOverviewComponent,', () => {
  let component: DocumentTemplateOverviewComponent;
  let fixture: ComponentFixture<DocumentTemplateOverviewComponent>;
  let page: Page;
  let activatedRoute: ActivatedRouteStub;

  class Page extends BasePage<DocumentTemplateOverviewComponent> {
    get title() {
      return this.query<HTMLDivElement>('.govuk-heading-l');
    }

    get contentSummaryList() {
      return this.queryAll<HTMLDListElement>('.govuk-summary-list')[0];
    }

    get content() {
      return Array.from(this.contentSummaryList.querySelectorAll('.govuk-summary-list__row'))
        .map((row) => [row.querySelector('dt'), row.querySelector('dd')])
        .map((pair) => pair.map((element) => element.textContent.trim()));
    }
  }

  beforeEach(async () => {
    activatedRoute = new ActivatedRouteStub({ templateId: mockedDocumentTemplate.id }, undefined, {
      documentTemplate: mockedDocumentTemplate,
    });
    await TestBed.configureTestingModule({
      imports: [DocumentTemplateOverviewComponent, PageHeadingComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTemplateOverviewComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the document template content', () => {
    expect(page.title.textContent).toEqual(mockedDocumentTemplate.name);
    expect(page.content).toEqual([['Uploaded Document', mockedDocumentTemplate.filename]]);
  });
});

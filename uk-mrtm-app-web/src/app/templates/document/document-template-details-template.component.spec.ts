import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { DocumentTemplateDetailsTemplateComponent } from '@templates/document/document-template-details-template.component';
import { mockedDocumentTemplate } from '@templates/testing/templates-data.mock';

describe('DocumentTemplateDetailsTemplateComponent', () => {
  let component: DocumentTemplateDetailsTemplateComponent;
  let fixture: ComponentFixture<TestComponent>;
  let page: Page;

  @Component({
    template: `
      <mrtm-document-template-details-template
        [documentTemplate]="documentTemplate"></mrtm-document-template-details-template>
    `,
  })
  class TestComponent {
    documentTemplate = mockedDocumentTemplate;
  }

  class Page extends BasePage<TestComponent> {
    get details() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [row.querySelector('dt'), row.querySelector('dd')])
        .map((pair) => pair.map((element) => element.textContent.trim()));
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentTemplateDetailsTemplateComponent],
      providers: [provideRouter([])],
      declarations: [TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.debugElement.query(By.directive(DocumentTemplateDetailsTemplateComponent)).componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the document template details', () => {
    expect(page.details).toEqual([
      ['Emails sending this document', 'View Email Template template'],
      ['Workflow', 'NETZ workflow'],
      ['Last changed', '3 Mar 2022'],
    ]);
  });
});

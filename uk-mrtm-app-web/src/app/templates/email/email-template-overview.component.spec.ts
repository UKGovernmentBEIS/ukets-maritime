import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { EmailTemplateOverviewComponent } from '@templates/email/email-template-overview.component';
import { mockedEmailTemplate } from '@templates/testing/mock-data';

describe('EmailTemplateOverviewComponent,', () => {
  let component: EmailTemplateOverviewComponent;
  let fixture: ComponentFixture<EmailTemplateOverviewComponent>;
  let page: Page;
  let activatedRoute: ActivatedRouteStub;

  class Page extends BasePage<EmailTemplateOverviewComponent> {
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
    activatedRoute = new ActivatedRouteStub({ templateId: mockedEmailTemplate.id }, undefined, {
      emailTemplate: mockedEmailTemplate,
    });
    await TestBed.configureTestingModule({
      imports: [EmailTemplateOverviewComponent],
      providers: [provideRouter([]), { provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateOverviewComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the email template content', () => {
    expect(page.title.textContent).toEqual(mockedEmailTemplate.name);
    expect(page.content).toEqual([
      ['Email subject', mockedEmailTemplate.subject],
      ['Email message', mockedEmailTemplate.text],
    ]);
  });
});

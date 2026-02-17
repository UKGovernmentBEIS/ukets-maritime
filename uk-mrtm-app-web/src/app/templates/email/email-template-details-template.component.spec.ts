import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { NotificationTemplateDTO } from '@mrtm/api';

import { BasePage } from '@netz/common/testing';

import { EmailTemplateDetailsTemplateComponent } from '@templates/email/email-template-details-template.component';
import { mockedEmailTemplate } from '@templates/testing/templates-data.mock';

describe('EmailTemplateDetailsTemplateComponent', () => {
  let component: EmailTemplateDetailsTemplateComponent;
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let page: Page;

  @Component({
    imports: [EmailTemplateDetailsTemplateComponent],
    standalone: true,
    template: `
      <mrtm-email-template-details-template [emailTemplate]="emailTemplate"></mrtm-email-template-details-template>
    `,
  })
  class TestComponent {
    emailTemplate: NotificationTemplateDTO;
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
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(EmailTemplateDetailsTemplateComponent)).componentInstance;
    page = new Page(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the email template details when no document templates exist', () => {
    testComponent.emailTemplate = mockedEmailTemplate;
    fixture.detectChanges();

    expect(page.details).toEqual([
      ['Attached documents', 'None'],
      ['Event trigger', 'Event that triggers the email'],
      ['Workflow', 'NETZ workflow'],
      ['Last changed', '2 Feb 2022'],
    ]);
  });

  it('should display the email template details when document templates exist', () => {
    testComponent.emailTemplate = {
      ...mockedEmailTemplate,
      documentTemplates: [
        {
          id: 11,
          name: 'Document #1',
        },
      ],
    };
    fixture.detectChanges();

    expect(page.details).toEqual([
      ['Attached documents', 'View Document #1 document template'],
      ['Event trigger', 'Event that triggers the email'],
      ['Workflow', 'NETZ workflow'],
      ['Last changed', '2 Feb 2022'],
    ]);
  });
});

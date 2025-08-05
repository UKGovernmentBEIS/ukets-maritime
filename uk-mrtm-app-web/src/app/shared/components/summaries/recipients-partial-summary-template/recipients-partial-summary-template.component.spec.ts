import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { RecipientsPartialSummaryTemplateComponent } from '@shared/components/summaries/recipients-partial-summary-template';

describe('RecipientsPartialSummaryTemplateComponent', () => {
  let component: RecipientsPartialSummaryTemplateComponent;
  let fixture: ComponentFixture<RecipientsPartialSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<RecipientsPartialSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipientsPartialSummaryTemplateComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipientsPartialSummaryTemplateComponent);
    fixture.componentRef.setInput('officialNoticeInfo', {
      users: [
        'Operator5 England, Operator admin - Primary contact, Service contact',
        'Operator5b England, Operator admin - Secondary contact',
        'Operator5c England, Operator - Financial contact',
      ],
      signatory: {
        name: 'Regulator England',
      },
      officialNotice: [
        {
          fileName: 'EFSN_Notice.pdf',
          downloadUrl: '/tasks/DOE00005-2023-1/timeline/52/file-download/document/c24226c1-9419-4e49-a872-21708d3ff887',
        },
      ],
    });
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.heading2.textContent).toEqual('Recipients');
    expect(page.summariesContents).toEqual([
      'Users',
      'Operator5 England, Operator admin - Primary contact, Service contactOperator5b England, Operator admin - Secondary contactOperator5c England, Operator - Financial contact',
      'Name and signature on the official notice',
      'Regulator England',
      'Official notice',
      'EFSN_Notice.pdf',
    ]);
  });
});

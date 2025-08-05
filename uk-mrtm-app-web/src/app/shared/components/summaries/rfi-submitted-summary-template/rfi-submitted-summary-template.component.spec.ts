import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { RfiSubmittedSummaryTemplateComponent } from '@shared/components';
import { RfiSubmitted } from '@shared/types';

describe('RfiSubmittedSummaryTemplateComponent', () => {
  class Page extends BasePage<RfiSubmittedSummaryTemplateComponent> {}
  let component: RfiSubmittedSummaryTemplateComponent;
  let fixture: ComponentFixture<RfiSubmittedSummaryTemplateComponent>;
  let page: Page;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfiSubmittedSummaryTemplateComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    fixture = TestBed.createComponent(RfiSubmittedSummaryTemplateComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.componentRef.setInput('data', {
      officialNotice: [
        {
          fileName: 'official notice',
          downloadUrl: '',
        },
      ],
      signatory: 'Regulator England',
      operators: ['Operator 1 - Primary contact, Service contact, Financial contact'],
      deadline: '2025-06-29',
      questions: ['q1', 'q2'],
      attachments: [
        {
          fileName: 'attachment 1',
          downloadUrl: '',
        },
        {
          fileName: 'attachment 2',
          downloadUrl: '',
        },
      ],
    } as RfiSubmitted);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Question 1',
      'q1',
      'Question 2',
      'q2',
      'Uploaded files',
      'attachment 1' + 'attachment 2',
      'Response deadline',
      '29 Jun 2025',
      'Users',
      'Operator 1 - Primary contact, Service contact, Financial contact',
      'Name and signature on the official notice',
      'Regulator England',
      'Official notice',
      'official notice',
    ]);
  });
});

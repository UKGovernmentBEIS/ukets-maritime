import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { EmpReviewedSummaryTemplateComponent } from '@shared/components/summaries/emp-reviewed-summary-template';

describe('EmpReviewedSummaryTemplateComponent', () => {
  let component: EmpReviewedSummaryTemplateComponent;
  let fixture: ComponentFixture<EmpReviewedSummaryTemplateComponent>;

  let page: Page;

  class Page extends BasePage<EmpReviewedSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpReviewedSummaryTemplateComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpReviewedSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', {
      determination: {
        type: 'APPROVED',
      },
      empFile: [
        {
          fileName: 'UK-E-MA-00020 v1.pdf',
          downloadUrl: '/tasks/MAMP00020/timeline/44/file-download/document/3ef417b7-3a32-4671-92de-a55be72cdb78',
        },
      ],
      users: ['Operator Admin - Primary contact, Service contact, Financial contact'],
      signatory: {
        name: 'Regulator2 Regulator2',
      },
      empApplication: {
        title: 'Emissions monitoring plan',
        url: '/accounts/20/workflows/MAMP00020',
      },
      officialNotice: [
        {
          fileName: 'official_notice_tmp.pdf',
          downloadUrl: '/tasks/MAMP00020/timeline/44/file-download/document/3ef417b7-3a32-4671-92de-a55be72cdb78',
        },
      ],
    });
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Emissions plan',
      'UK-E-MA-00020 v1.pdf',
      'Emissions plan application',
      'Emissions monitoring plan',
      'Decision',
      'Approve',
      'Users',
      'Operator Admin - Primary contact, Service contact, Financial contact',
      'Name and signature on the official notice',
      'Regulator2 Regulator2',
      'Official notice',
      'official_notice_tmp.pdf',
    ]);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { EmpVariationReviewedSummaryTemplateComponent } from '@shared/components/summaries/emp-variation-reviewed-summary-template';
import { EmpVariationReviewedDto } from '@shared/types';

describe('EmpVariationReviewedSummaryTemplateComponent', () => {
  let component: EmpVariationReviewedSummaryTemplateComponent;
  let fixture: ComponentFixture<EmpVariationReviewedSummaryTemplateComponent>;

  let page: Page;

  class Page extends BasePage<EmpVariationReviewedSummaryTemplateComponent> {}

  const mockData: EmpVariationReviewedDto = {
    determination: {
      type: 'APPROVED',
    },
    empFile: [
      {
        fileName: 'UK-E-MA-00020 v2.pdf',
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
        fileName: 'emp_variation_approved.pdf',
        downloadUrl: '/tasks/MAMP00020/timeline/44/file-download/document/3ef417b7-3a32-4671-92de-a55be72cdb78',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVariationReviewedSummaryTemplateComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpVariationReviewedSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockData);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements for APPROVED', () => {
    expect(page.summariesContents).toEqual([
      'Emissions plan',
      'UK-E-MA-00020 v2.pdf',
      'Emissions plan application',
      'Emissions monitoring plan',
      'Decision',
      'Approve',
      'Users',
      'Operator Admin - Primary contact, Service contact, Financial contact',
      'Name and signature on the official notice',
      'Regulator2 Regulator2',
      'Official notice',
      'emp_variation_approved.pdf',
    ]);
  });

  it('should display all HTML elements for REJECTED', () => {
    fixture.componentRef.setInput('data', {
      ...mockData,
      determination: {
        type: 'REJECTED',
      },
    });
    fixture.detectChanges();

    expect(page.summariesContents).toEqual([
      'Emissions plan',
      'UK-E-MA-00020 v2.pdf',
      'Decision',
      'Rejected',
      'Users',
      'Operator Admin - Primary contact, Service contact, Financial contact',
      'Name and signature on the official notice',
      'Regulator2 Regulator2',
      'Official notice',
      'emp_variation_approved.pdf',
    ]);
  });
});

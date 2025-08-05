import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { EmpBatchReissueSummaryTemplateComponent } from '@shared/components';

describe('EmpBatchReissueSummaryTemplateComponent', () => {
  class Page extends BasePage<EmpBatchReissueSummaryTemplateComponent> {}

  let component: EmpBatchReissueSummaryTemplateComponent;
  let fixture: ComponentFixture<EmpBatchReissueSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpBatchReissueSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpBatchReissueSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('actionType', 'EMP_BATCH_REISSUE_SUBMITTED');
    fixture.componentRef.setInput('data', {
      id: 'BRA0003-E',
      createdBy: 'Regulator England',
      summary: 'Lorem ipsum',
      signatory: 'Regulator England',
      createdDate: '2025-01-14T16:53:53.256965Z',
      documents: [],
    });
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Created by',
      'Regulator England',
      'Date created',
      '14 Jan 2025',
      'Signatory',
      'Regulator England',
      'Summary of changes',
      'Lorem ipsum',
      'Batch variation report',
      'In progress',
    ]);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { EmpPeerReviewDecisionSummaryTemplateComponent } from '@shared/components/summaries/emp-peer-review-decision-summary-template';
import { determinationTypeMap } from '@shared/components/summaries/emp-peer-review-decision-summary-template/emp-peer-review-decision-summary-template.consts';
import { EmpPeerReviewDecisionDto } from '@shared/types';

describe('EmpPeerReviewDecisionSummaryTemplateComponent', () => {
  class Page extends BasePage<EmpPeerReviewDecisionSummaryTemplateComponent> {}
  let component: EmpPeerReviewDecisionSummaryTemplateComponent;
  let fixture: ComponentFixture<EmpPeerReviewDecisionSummaryTemplateComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpPeerReviewDecisionSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpPeerReviewDecisionSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', {});
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements for empty data', () => {
    expect(page.summariesContents).toEqual([
      'Peer review decision',
      'Not provided',
      'Supporting notes',
      'Not provided',
      'Peer reviewer',
      'Not provided',
    ]);
  });

  it.each<EmpPeerReviewDecisionDto['type']>(['AGREE', 'DISAGREE'])(
    'should display all HTML elements for type %s',
    (type) => {
      fixture.componentRef.setInput('data', {
        type,
        notes: 'some test notes',
        submitter: 'Test submitter',
      });

      fixture.detectChanges();

      expect(page.summariesContents).toEqual([
        'Peer review decision',
        determinationTypeMap[type],
        'Supporting notes',
        'some test notes',
        'Peer reviewer',
        'Test submitter',
      ]);
    },
  );
});

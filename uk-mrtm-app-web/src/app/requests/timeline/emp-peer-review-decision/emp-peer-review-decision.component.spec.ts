import { ComponentFixture, TestBed } from '@angular/core/testing';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { BasePage } from '@netz/common/testing';

import { EmpPeerReviewDecisionComponent } from '@requests/timeline/emp-peer-review-decision/emp-peer-review-decision.component';
import { EmpPeerReviewDecisionTaskPayload } from '@requests/timeline/emp-peer-review-decision/emp-peer-review-decision.types';

describe('EmpPeerReviewDecisionComponent', () => {
  class Page extends BasePage<EmpPeerReviewDecisionComponent> {}

  let component: EmpPeerReviewDecisionComponent;
  let fixture: ComponentFixture<EmpPeerReviewDecisionComponent>;
  let page: Page;
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpPeerReviewDecisionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpPeerReviewDecisionComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        type: 'EMP_ISSUANCE_APPLICATION_PEER_REVIEWER_REJECTED',
        submitter: 'Regulator england',
        payload: {
          payloadType: 'EMP_ISSUANCE_PEER_REVIEW_DECISION_SUBMITTED_PAYLOAD',
          decision: {
            type: 'DISAGREE',
            notes: 'some test notes',
          },
        } as EmpPeerReviewDecisionTaskPayload,
      },
    });
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements for empty data', () => {
    expect(page.summariesContents).toEqual([
      'Peer review decision',
      'I do not agree with the determination',
      'Supporting notes',
      'some test notes',
      'Peer reviewer',
      'Regulator england',
    ]);
  });
});

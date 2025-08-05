import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerReviewDecisionSubmittedRequestActionPayload } from '@mrtm/api';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';

import { PeerReviewDecisionComponent } from '@requests/timeline/peer-review-decision/peer-review-decision.component';

describe('PeerReviewDecisionComponent', () => {
  let component: PeerReviewDecisionComponent;
  let fixture: ComponentFixture<PeerReviewDecisionComponent>;
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerReviewDecisionComponent],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
          decision: {
            notes: 'notes',
            type: 'AGREE',
          },
          payloadType: '',
        } as PeerReviewDecisionSubmittedRequestActionPayload,
      },
    });
    fixture = TestBed.createComponent(PeerReviewDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

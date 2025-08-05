import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import { initialPeerReviewState, PeerReviewStore } from '@requests/tasks/notification-peer-review/+state';
import { PeerReviewDecisionSuccessComponent } from '@requests/tasks/notification-peer-review/peer-review-decision/peer-review-decision-success/peer-review-decision-success.component';

describe('PeerReviewDecisionSuccessComponent', () => {
  let component: PeerReviewDecisionSuccessComponent;
  let fixture: ComponentFixture<PeerReviewDecisionSuccessComponent>;
  const route = new ActivatedRouteStub();
  let store: PeerReviewStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerReviewDecisionSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...taskProviders],
    }).compileComponents();

    store = TestBed.inject(PeerReviewStore);
    fixture = TestBed.createComponent(PeerReviewDecisionSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the store when leaving the page', () => {
    store.setDecision({
      accepted: true,
      isSubmitted: true,
      notes: 'agreement notes',
    });
    fixture.destroy();
    expect(store.state).toEqual(initialPeerReviewState);
  });
});

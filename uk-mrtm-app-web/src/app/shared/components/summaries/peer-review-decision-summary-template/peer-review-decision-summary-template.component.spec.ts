import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerReviewDecisionSummaryTemplateComponent } from '@shared/components';

describe('PeerReviewDecisionSummaryTemplateComponent', () => {
  let component: PeerReviewDecisionSummaryTemplateComponent;
  let fixture: ComponentFixture<PeerReviewDecisionSummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerReviewDecisionSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PeerReviewDecisionSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('decision', {
      type: 'AGREE',
      notes: 'notes',
    });
    fixture.componentRef.setInput('peerReviewer', 'peer reviewer');
    fixture.componentRef.setInput('map', {
      caption: 'Peer review response',
      decision: 'Peer review decision',
      notes: 'Supporting notes',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

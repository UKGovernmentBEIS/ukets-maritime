import { ComponentFixture, TestBed } from '@angular/core/testing';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';

import { NonComplianceFinalDeterminationSubmittedTimelinePayload } from '@requests/common/non-compliance';
import { NonComplianceFinalDeterminationSubmittedComponent } from '@requests/timeline/non-compliance-final-determination-submitted/non-compliance-final-determination-submitted.component';

describe('NonComplianceFinalDeterminationSubmittedComponent', () => {
  let component: NonComplianceFinalDeterminationSubmittedComponent;
  let fixture: ComponentFixture<NonComplianceFinalDeterminationSubmittedComponent>;
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceFinalDeterminationSubmittedComponent],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
          payloadType: 'NON_COMPLIANCE_FINAL_DETERMINATION_APPLICATION_SUBMITTED_PAYLOAD',
          complianceRestored: 'YES',
          complianceRestoredDate: '2025-01-02',
          comments: 'GG',
          reissuePenalty: true,
          operatorPaid: true,
          operatorPaidDate: '2025-03-03',
          sectionsCompleted: { details: 'COMPLETED' },
        } as NonComplianceFinalDeterminationSubmittedTimelinePayload,
      },
    });

    fixture = TestBed.createComponent(NonComplianceFinalDeterminationSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';

import { NonComplianceSubmittedTimelinePayload } from '@requests/common/non-compliance';
import { NonComplianceSubmittedComponent } from '@requests/timeline/non-compliance-submitted/non-compliance-submitted.component';

describe('NonComplianceSubmittedComponent', () => {
  let component: NonComplianceSubmittedComponent;
  let fixture: ComponentFixture<NonComplianceSubmittedComponent>;
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceSubmittedComponent],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
          payloadType: 'NON_COMPLIANCE_APPLICATION_SUBMITTED_PAYLOAD',
          reason: 'FAILURE_TO_MONITOR_EMISSIONS',
          nonComplianceDate: '2023-04-02',
          complianceDate: '2025-03-03',
          comments: 'Lorem ipsum',
          selectedRequests: [
            { id: 'MAR00009-2024', type: 'AER' },
            { id: 'MAMP00009', type: 'EMP_ISSUANCE' },
          ],
          civilPenalty: false,
          noCivilPenaltyJustification: 'Dolor sit',
          sectionsCompleted: { details: 'COMPLETED' },
        } as NonComplianceSubmittedTimelinePayload,
      },
    });

    fixture = TestBed.createComponent(NonComplianceSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

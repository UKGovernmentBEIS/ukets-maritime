import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonComplianceAmendDetailsRequestTaskActionPayload } from '@mrtm/api';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';

import { NonComplianceDetailsAmendedComponent } from '@requests/timeline/non-compliance-details-amended/non-compliance-details-amended.component';

describe('NonComplianceDetailsAmendedComponent', () => {
  let component: NonComplianceDetailsAmendedComponent;
  let fixture: ComponentFixture<NonComplianceDetailsAmendedComponent>;
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceDetailsAmendedComponent],
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
          nonComplianceComments: 'Lorem ipsum',
        } as NonComplianceAmendDetailsRequestTaskActionPayload,
      },
    });

    fixture = TestBed.createComponent(NonComplianceDetailsAmendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

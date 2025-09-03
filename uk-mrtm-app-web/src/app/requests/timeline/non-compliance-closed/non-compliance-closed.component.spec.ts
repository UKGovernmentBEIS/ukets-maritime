import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonComplianceApplicationClosedRequestActionPayload } from '@mrtm/api';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';

import { NonComplianceClosedComponent } from '@requests/timeline/non-compliance-closed/non-compliance-closed.component';

describe('NonComplianceClosedComponent', () => {
  let component: NonComplianceClosedComponent;
  let fixture: ComponentFixture<NonComplianceClosedComponent>;
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceClosedComponent],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
          payloadType: 'NON_COMPLIANCE_CLOSE_APPLICATION_PAYLOAD',
          reason: 'Lorem ipsum',
        } as NonComplianceApplicationClosedRequestActionPayload,
      },
    });

    fixture = TestBed.createComponent(NonComplianceClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

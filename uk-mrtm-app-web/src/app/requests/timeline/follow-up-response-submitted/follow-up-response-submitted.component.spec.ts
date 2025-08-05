import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpNotificationFollowUpResponseSubmittedRequestActionPayload } from '@mrtm/api';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';

import { FollowUpResponseSubmittedComponent } from '@requests/timeline/follow-up-response-submitted/follow-up-response-submitted.component';

describe('FollowUpResponseSubmittedComponent', () => {
  let component: FollowUpResponseSubmittedComponent;
  let fixture: ComponentFixture<FollowUpResponseSubmittedComponent>;
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowUpResponseSubmittedComponent],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
          request: 'request',
          response: 'response',
          responseFiles: [],
          payloadType: 'EMP_NOTIFICATION_FOLLOW_UP_RESPONSE_SUBMITTED_PAYLOAD',
        } as EmpNotificationFollowUpResponseSubmittedRequestActionPayload,
      },
    });
    fixture = TestBed.createComponent(FollowUpResponseSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

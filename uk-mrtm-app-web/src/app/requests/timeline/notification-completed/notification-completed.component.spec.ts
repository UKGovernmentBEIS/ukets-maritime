import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload } from '@mrtm/api';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { NotificationCompletedComponent } from '@requests/timeline/notification-completed/notification-completed.component';
import { NotificationReviewDecisionUnion } from '@shared/types';

describe('NotificationCompletedComponent', () => {
  let component: NotificationCompletedComponent;
  let fixture: ComponentFixture<NotificationCompletedComponent>;
  const route = new ActivatedRouteStub();
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationCompletedComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
          payloadType: 'EMP_NOTIFICATION_APPLICATION_COMPLETED_PAYLOAD',
          request: 'request',
          response: 'response',
          reviewDecision: {
            details: {
              notes: 'notes',
            },
            type: 'ACCEPTED',
          } as NotificationReviewDecisionUnion,
          usersInfo: {
            '123': {
              name: 'Regulator',
            },
            '456': {
              name: 'Operator',
              roleCode: 'operator_admin',
              contactTypes: ['PRIMARY', 'SERVICE', 'FINANCIAL'],
            },
          },
          reviewDecisionNotification: {
            signatory: '123',
          },
        } as unknown as EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload,
      },
    });
    route.snapshot.params = { taskId: 1 };
    fixture = TestBed.createComponent(NotificationCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

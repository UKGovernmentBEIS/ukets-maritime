import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload } from '@mrtm/api';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { NotificationDecisionComponent } from '@requests/timeline/notification-decision/notification-decision.component';
import { NotificationReviewDecisionUnion } from '@shared/types';

describe('NotificationDecisionComponent', () => {
  let component: NotificationDecisionComponent;
  let fixture: ComponentFixture<NotificationDecisionComponent>;
  const route = new ActivatedRouteStub();
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationDecisionComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
          officialNotice: {
            name: 'file name',
            uuid: '1',
          },
          reviewDecision: {
            details: {
              officialNotice: 'notice text',
              notes: 'notes',
              followUp: {
                followUpResponseRequired: false,
                followUpRequest: null,
                followUpResponseExpirationDate: null,
              },
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
        } as unknown as EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload,
      },
    });
    route.snapshot.params = { taskId: 1 };
    fixture = TestBed.createComponent(NotificationDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

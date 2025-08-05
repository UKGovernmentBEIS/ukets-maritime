import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { EmpNotificationApplicationSubmittedRequestActionPayload } from '@mrtm/api';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { NotificationSubmittedComponent } from '@requests/timeline/notification-submitted/notification-submitted.component';

describe('NotificationSubmittedComponent', () => {
  let component: NotificationSubmittedComponent;
  let fixture: ComponentFixture<NotificationSubmittedComponent>;
  const route = new ActivatedRouteStub();
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
          emissionsMonitoringPlanNotification: {
            detailsOfChange: {
              documents: [],
            },
          },
        } as EmpNotificationApplicationSubmittedRequestActionPayload,
      },
    });
    route.snapshot.params = { taskId: 1 };
    fixture = TestBed.createComponent(NotificationSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpNotificationFollowUpReturnedForAmendsRequestActionPayload } from '@mrtm/api';

import { mockRequestAction } from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';

import { FollowUpReturnedForAmendsComponent } from '@requests/timeline/follow-up-returned-for-amends/follow-up-returned-for-amends.component';

describe('FollowUpReturnedForAmendsComponent', () => {
  let component: FollowUpReturnedForAmendsComponent;
  let fixture: ComponentFixture<FollowUpReturnedForAmendsComponent>;
  let store: RequestActionStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowUpReturnedForAmendsComponent],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState({
      action: {
        ...mockRequestAction,
        payload: {
          decisionDetails: {
            notes: '',
            requiredChanges: [],
            dueDate: '',
          },
          payloadType: 'EMP_NOTIFICATION_FOLLOW_UP_RETURNED_FOR_AMENDS_PAYLOAD',
          amendAttachments: {},
          sectionsCompleted: {
            reviewDecision: 'AMENDS_NEEDED',
          },
        } as EmpNotificationFollowUpReturnedForAmendsRequestActionPayload,
      },
    });
    fixture = TestBed.createComponent(FollowUpReturnedForAmendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

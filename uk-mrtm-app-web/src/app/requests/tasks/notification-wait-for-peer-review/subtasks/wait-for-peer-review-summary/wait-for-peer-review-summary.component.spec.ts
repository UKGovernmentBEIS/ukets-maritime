import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import { WaitForPeerReviewSummaryComponent } from '@requests/tasks/notification-wait-for-peer-review/subtasks/wait-for-peer-review-summary';

describe('WaitForPeerReviewSummaryComponent', () => {
  let component: WaitForPeerReviewSummaryComponent;
  let fixture: ComponentFixture<WaitForPeerReviewSummaryComponent>;
  const route = new ActivatedRouteStub();
  let store: RequestTaskStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitForPeerReviewSummaryComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }, ...taskProviders],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState({
      ...mockRequestTask,
      requestTaskItem: {
        ...mockRequestTask.requestTaskItem,
        requestTask: {
          ...mockRequestTask.requestTaskItem.requestTask,
          type: 'EMP_NOTIFICATION_WAIT_FOR_PEER_REVIEW',
          payload: {
            payloadType: 'EMP_NOTIFICATION_WAIT_FOR_PEER_REVIEW_PAYLOAD',
          },
        },
      },
    });
    fixture = TestBed.createComponent(WaitForPeerReviewSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

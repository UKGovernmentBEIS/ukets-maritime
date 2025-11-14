import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { mockNonComplianceNoticeOfIntentRequestTask } from '@requests/common/non-compliance/testing';
import { taskProviders } from '@requests/common/task.providers';
import { NonComplianceNoticeOfIntentUploadSummaryReviewComponent } from '@requests/tasks/non-compliance-notice-of-intent-peer-review/subtasks/upload/non-compliance-notice-of-intent-upload-summary-review';

describe('NonComplianceNoticeOfIntentUploadSummaryReviewComponent', () => {
  let component: NonComplianceNoticeOfIntentUploadSummaryReviewComponent;
  let fixture: ComponentFixture<NonComplianceNoticeOfIntentUploadSummaryReviewComponent>;
  let store: RequestTaskStore;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceNoticeOfIntentUploadSummaryReviewComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockNonComplianceNoticeOfIntentRequestTask);

    fixture = TestBed.createComponent(NonComplianceNoticeOfIntentUploadSummaryReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

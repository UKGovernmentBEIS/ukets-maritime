import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { mockNonComplianceInitialPenaltyNoticeRequestTask } from '@requests/common/non-compliance/testing';
import { NonComplianceInitialPenaltyNoticeUploadSummaryReviewComponent } from '@requests/tasks/non-compliance-initial-penalty-notice-peer-review/subtasks/upload/non-compliance-initial-penalty-notice-upload-summary-review';

describe('NonComplianceInitialPenaltyNoticeUploadSummaryReviewComponent', () => {
  let component: NonComplianceInitialPenaltyNoticeUploadSummaryReviewComponent;
  let fixture: ComponentFixture<NonComplianceInitialPenaltyNoticeUploadSummaryReviewComponent>;
  let store: RequestTaskStore;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceInitialPenaltyNoticeUploadSummaryReviewComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockNonComplianceInitialPenaltyNoticeRequestTask);

    fixture = TestBed.createComponent(NonComplianceInitialPenaltyNoticeUploadSummaryReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

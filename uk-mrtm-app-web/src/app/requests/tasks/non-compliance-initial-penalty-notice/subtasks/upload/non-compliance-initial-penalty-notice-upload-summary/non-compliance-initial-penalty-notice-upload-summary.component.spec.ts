import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { mockNonComplianceInitialPenaltyNoticeRequestTask } from '@requests/common/non-compliance/testing';
import { taskProviders } from '@requests/common/task.providers';
import { NonComplianceInitialPenaltyNoticeUploadSummaryComponent } from '@requests/tasks/non-compliance-initial-penalty-notice/subtasks/upload/non-compliance-initial-penalty-notice-upload-summary';

describe('NonComplianceInitialPenaltyNoticeSummaryComponent', () => {
  let component: NonComplianceInitialPenaltyNoticeUploadSummaryComponent;
  let fixture: ComponentFixture<NonComplianceInitialPenaltyNoticeUploadSummaryComponent>;
  let store: RequestTaskStore;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceInitialPenaltyNoticeUploadSummaryComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockNonComplianceInitialPenaltyNoticeRequestTask);

    fixture = TestBed.createComponent(NonComplianceInitialPenaltyNoticeUploadSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

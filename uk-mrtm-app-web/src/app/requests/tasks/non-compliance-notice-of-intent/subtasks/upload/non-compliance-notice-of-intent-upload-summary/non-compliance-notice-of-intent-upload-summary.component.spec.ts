import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { mockNonComplianceNoticeOfIntentRequestTask } from '@requests/common/non-compliance/testing';
import { NonComplianceNoticeOfIntentUploadSummaryComponent } from '@requests/tasks/non-compliance-notice-of-intent/subtasks/upload/non-compliance-notice-of-intent-upload-summary';

describe('NonComplianceNoticeOfIntentSummaryComponent', () => {
  let component: NonComplianceNoticeOfIntentUploadSummaryComponent;
  let fixture: ComponentFixture<NonComplianceNoticeOfIntentUploadSummaryComponent>;
  let store: RequestTaskStore;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceNoticeOfIntentUploadSummaryComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockNonComplianceNoticeOfIntentRequestTask);

    fixture = TestBed.createComponent(NonComplianceNoticeOfIntentUploadSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

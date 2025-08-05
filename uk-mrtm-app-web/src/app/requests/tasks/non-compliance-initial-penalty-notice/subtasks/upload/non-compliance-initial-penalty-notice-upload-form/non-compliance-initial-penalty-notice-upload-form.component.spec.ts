import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { mockNonComplianceInitialPenaltyNoticeRequestTask } from '@requests/common/non-compliance/testing';
import { NonComplianceInitialPenaltyNoticeUploadFormComponent } from '@requests/tasks/non-compliance-initial-penalty-notice/subtasks/upload/non-compliance-initial-penalty-notice-upload-form';

describe('NonComplianceInitialPenaltyNoticeFormComponent', () => {
  let component: NonComplianceInitialPenaltyNoticeUploadFormComponent;
  let fixture: ComponentFixture<NonComplianceInitialPenaltyNoticeUploadFormComponent>;
  let store: RequestTaskStore;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceInitialPenaltyNoticeUploadFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockNonComplianceInitialPenaltyNoticeRequestTask);

    fixture = TestBed.createComponent(NonComplianceInitialPenaltyNoticeUploadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

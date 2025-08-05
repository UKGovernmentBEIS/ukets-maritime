import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskAttachmentsHandlingService } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, mockClass, MockType } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import {
  AER_REVIEW_AVAILABLE_OPTIONS,
  AER_REVIEW_DATA_TYPE,
  AER_REVIEW_GROUP,
  AER_REVIEW_SUBTASK,
  AER_REVIEW_TASK_TITLE,
} from '@requests/tasks/aer-review/aer-review.constants';
import { ReviewApplicationFormComponent } from '@requests/tasks/aer-review/subtasks/review-application/review-application-form/review-application-form.component';

describe('ReviewApplicationFormComponent', () => {
  let component: ReviewApplicationFormComponent;
  let fixture: ComponentFixture<ReviewApplicationFormComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};
  const attachmentsService = mockClass(RequestTaskAttachmentsHandlingService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewApplicationFormComponent],
      providers: [
        { provide: RequestTaskAttachmentsHandlingService, useValue: attachmentsService },
        { provide: AER_REVIEW_GROUP, useValue: 'MOCK_GROUP' },
        { provide: AER_REVIEW_SUBTASK, useValue: 'MOCK_SUBTASK' },
        { provide: AER_REVIEW_TASK_TITLE, useValue: 'MOCK_TASK_TITLE' },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: TaskService, useValue: taskServiceMock },
        { provide: AER_REVIEW_AVAILABLE_OPTIONS, useValue: ['ACCEPTED', 'OPERATOR_AMENDS_NEEDED'] },
        { provide: AER_REVIEW_DATA_TYPE, useValue: 'MOCK_DATA_TYPE' },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

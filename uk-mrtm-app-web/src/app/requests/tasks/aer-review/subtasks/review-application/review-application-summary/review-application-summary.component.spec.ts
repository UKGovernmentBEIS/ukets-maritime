import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import {
  AER_REVIEW_GROUP,
  AER_REVIEW_SUBTASK,
  AER_REVIEW_TASK_TITLE,
} from '@requests/tasks/aer-review/aer-review.constants';
import { ReviewApplicationSummaryComponent } from '@requests/tasks/aer-review/subtasks/review-application/review-application-summary/review-application-summary.component';

describe('ReviewApplicationSummaryComponent', () => {
  let component: ReviewApplicationSummaryComponent;
  let fixture: ComponentFixture<ReviewApplicationSummaryComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewApplicationSummaryComponent],
      providers: [
        { provide: AER_REVIEW_GROUP, useValue: 'MOCK_GROUP' },
        { provide: AER_REVIEW_SUBTASK, useValue: 'MOCK_SUBTASK' },
        { provide: AER_REVIEW_TASK_TITLE, useValue: 'MOCK_TASK_TITLE' },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewApplicationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

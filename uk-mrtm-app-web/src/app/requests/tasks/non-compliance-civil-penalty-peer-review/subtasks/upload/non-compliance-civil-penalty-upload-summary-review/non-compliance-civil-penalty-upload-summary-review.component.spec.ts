import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { mockNonComplianceCivilPenaltyRequestTask } from '@requests/common/non-compliance/testing';
import { NonComplianceCivilPenaltyUploadSummaryReviewComponent } from '@requests/tasks/non-compliance-civil-penalty-peer-review/subtasks/upload/non-compliance-civil-penalty-upload-summary-review';

describe('NonComplianceCivilPenaltyUploadSummaryReviewComponent', () => {
  let component: NonComplianceCivilPenaltyUploadSummaryReviewComponent;
  let fixture: ComponentFixture<NonComplianceCivilPenaltyUploadSummaryReviewComponent>;
  let store: RequestTaskStore;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceCivilPenaltyUploadSummaryReviewComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockNonComplianceCivilPenaltyRequestTask);

    fixture = TestBed.createComponent(NonComplianceCivilPenaltyUploadSummaryReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

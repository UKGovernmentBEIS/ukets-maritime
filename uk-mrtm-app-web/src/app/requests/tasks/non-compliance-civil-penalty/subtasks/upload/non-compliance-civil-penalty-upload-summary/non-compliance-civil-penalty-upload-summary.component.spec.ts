import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { mockNonComplianceCivilPenaltyRequestTask } from '@requests/common/non-compliance/testing';
import { taskProviders } from '@requests/common/task.providers';
import { NonComplianceCivilPenaltyUploadSummaryComponent } from '@requests/tasks/non-compliance-civil-penalty/subtasks/upload/non-compliance-civil-penalty-upload-summary';

describe('NonComplianceCivilPenaltyUploadSummaryComponent', () => {
  let component: NonComplianceCivilPenaltyUploadSummaryComponent;
  let fixture: ComponentFixture<NonComplianceCivilPenaltyUploadSummaryComponent>;
  let store: RequestTaskStore;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceCivilPenaltyUploadSummaryComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockNonComplianceCivilPenaltyRequestTask);

    fixture = TestBed.createComponent(NonComplianceCivilPenaltyUploadSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

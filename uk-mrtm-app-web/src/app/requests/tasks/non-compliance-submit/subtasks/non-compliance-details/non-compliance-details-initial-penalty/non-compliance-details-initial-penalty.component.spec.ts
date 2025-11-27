import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { mockNonComplianceSubmitRequestTask } from '@requests/common/non-compliance/testing';
import { taskProviders } from '@requests/common/task.providers';
import { NonComplianceDetailsInitialPenaltyComponent } from '@requests/tasks/non-compliance-submit/subtasks/non-compliance-details/non-compliance-details-initial-penalty';

describe('NonComplianceDetailsInitialPenaltyComponent', () => {
  let component: NonComplianceDetailsInitialPenaltyComponent;
  let fixture: ComponentFixture<NonComplianceDetailsInitialPenaltyComponent>;
  let store: RequestTaskStore;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceDetailsInitialPenaltyComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockNonComplianceSubmitRequestTask);

    fixture = TestBed.createComponent(NonComplianceDetailsInitialPenaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

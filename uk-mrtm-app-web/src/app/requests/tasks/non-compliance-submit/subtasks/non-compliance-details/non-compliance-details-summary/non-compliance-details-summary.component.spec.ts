import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { mockNonComplianceSubmitRequestTask } from '@requests/common/non-compliance/testing';
import { taskProviders } from '@requests/common/task.providers';
import { NonComplianceDetailsSummaryComponent } from '@requests/tasks/non-compliance-submit/subtasks/non-compliance-details/non-compliance-details-summary';

describe('NonComplianceDetailsSummaryComponent', () => {
  let component: NonComplianceDetailsSummaryComponent;
  let fixture: ComponentFixture<NonComplianceDetailsSummaryComponent>;
  let store: RequestTaskStore;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceDetailsSummaryComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockNonComplianceSubmitRequestTask);

    fixture = TestBed.createComponent(NonComplianceDetailsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

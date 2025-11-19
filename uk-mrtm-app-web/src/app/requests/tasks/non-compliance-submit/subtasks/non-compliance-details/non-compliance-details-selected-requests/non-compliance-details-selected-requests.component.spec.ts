import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { mockNonComplianceSubmitRequestTask } from '@requests/common/non-compliance/testing';
import { NonComplianceDetailsSelectedRequestsComponent } from '@requests/tasks/non-compliance-submit/subtasks/non-compliance-details/non-compliance-details-selected-requests';

describe('NonComplianceDetailsSelectedRequestsComponent', () => {
  let component: NonComplianceDetailsSelectedRequestsComponent;
  let fixture: ComponentFixture<NonComplianceDetailsSelectedRequestsComponent>;
  let store: RequestTaskStore;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceDetailsSelectedRequestsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockNonComplianceSubmitRequestTask);

    fixture = TestBed.createComponent(NonComplianceDetailsSelectedRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

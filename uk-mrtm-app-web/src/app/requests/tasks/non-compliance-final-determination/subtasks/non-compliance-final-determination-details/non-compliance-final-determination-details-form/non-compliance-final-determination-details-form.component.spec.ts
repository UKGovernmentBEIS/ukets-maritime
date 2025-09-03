import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { mockNonComplianceFinalDeterminationRequestTask } from '@requests/common/non-compliance/testing';
import { NonComplianceFinalDeterminationDetailsFormComponent } from '@requests/tasks/non-compliance-final-determination/subtasks/non-compliance-final-determination-details/non-compliance-final-determination-details-form';

describe('NonComplianceFinalDeterminationDetailsFormComponent', () => {
  let component: NonComplianceFinalDeterminationDetailsFormComponent;
  let fixture: ComponentFixture<NonComplianceFinalDeterminationDetailsFormComponent>;
  let store: RequestTaskStore;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceFinalDeterminationDetailsFormComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockNonComplianceFinalDeterminationRequestTask);

    fixture = TestBed.createComponent(NonComplianceFinalDeterminationDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

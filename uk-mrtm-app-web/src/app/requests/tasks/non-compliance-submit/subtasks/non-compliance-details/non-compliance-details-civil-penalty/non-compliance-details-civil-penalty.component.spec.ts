import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { mockNonComplianceSubmitRequestTask } from '@requests/common/non-compliance/testing';
import { NonComplianceDetailsCivilPenaltyComponent } from '@requests/tasks/non-compliance-submit/subtasks/non-compliance-details/non-compliance-details-civil-penalty';

describe('NonComplianceDetailsCivilPenaltyComponent', () => {
  let component: NonComplianceDetailsCivilPenaltyComponent;
  let fixture: ComponentFixture<NonComplianceDetailsCivilPenaltyComponent>;
  let store: RequestTaskStore;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceDetailsCivilPenaltyComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockNonComplianceSubmitRequestTask);

    fixture = TestBed.createComponent(NonComplianceDetailsCivilPenaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import {
  CONTROL_ACTIVITIES_SUB_TASK,
  ControlActivitiesWizardStep,
} from '@requests/common/emp/subtasks/control-activities';
import { ControlActivitiesSummaryComponent } from '@requests/common/emp/subtasks/control-activities/control-activities-summary';
import { controlActivitiesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { mockEmpControlActivities, mockStateBuild } from '@requests/common/emp/testing/emp-data.mock';
import { taskProviders } from '@requests/common/task.providers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { screen } from '@testing-library/angular';

describe('ControlActivitiesSummaryComponent', () => {
  let fixture: ComponentFixture<ControlActivitiesSummaryComponent>;
  let component: ControlActivitiesSummaryComponent;
  let store: RequestTaskStore;

  const activatedRouteStub = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<unknown>> = {
    submitSubtask: jest.fn().mockReturnValue(of({})),
  };

  const taskServiceSpy = jest.spyOn(taskServiceMock, 'submitSubtask');

  const createComponent = () => {
    fixture = TestBed.createComponent(ControlActivitiesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlActivitiesSummaryComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        ...taskProviders,
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState(
      mockStateBuild(
        {
          controlActivities: mockEmpControlActivities,
        },
        {
          controlActivities: TaskItemStatus.IN_PROGRESS,
        },
      ),
    );
    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(screen.getAllByRole('heading')[0].textContent).toEqual('Check your answers');

    const summarySections = screen
      .getAllByRole('heading')
      .slice(1)
      .map((section) => section.textContent);

    expect(summarySections).toEqual([
      controlActivitiesMap.qualityAssurance.title,
      controlActivitiesMap.internalReviews.title,
      controlActivitiesMap.corrections.title,
      controlActivitiesMap.outsourcedActivities.title,
      controlActivitiesMap.documentation.title,
    ]);

    expect([...new Set(screen.getAllByRole('term').map((term) => term.textContent.trim()))]).toEqual([
      'Procedure reference',
      'Procedure version',
      'Description of procedure',
      'Name of person or position responsible for this procedure',
      'Location where records are kept',
      'Name of IT system used',
      'Are any of your activities outsourced?',
    ]);
  });

  it('should submit subtask', () => {
    screen.getByRole('button', { name: 'Confirm and continue' }).click();

    expect(taskServiceSpy).toHaveBeenCalledWith(
      CONTROL_ACTIVITIES_SUB_TASK,
      ControlActivitiesWizardStep.SUMMARY,
      activatedRouteStub,
    );
  });
});

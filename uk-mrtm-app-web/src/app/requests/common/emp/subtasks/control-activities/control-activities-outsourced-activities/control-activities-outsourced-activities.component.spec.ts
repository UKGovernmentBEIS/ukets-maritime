import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import {
  CONTROL_ACTIVITIES_SUB_TASK,
  ControlActivitiesWizardStep,
} from '@requests/common/emp/subtasks/control-activities';
import { ControlActivitiesOutsourcedActivitiesComponent } from '@requests/common/emp/subtasks/control-activities/control-activities-outsourced-activities/control-activities-outsourced-activities.component';
import {
  mockEmpControlActivities,
  mockEmpIssuanceSubmitRequestTask,
  mockStateBuild,
} from '@requests/common/emp/testing/mock-data';
import { taskProviders } from '@requests/common/task.providers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { fireEvent, screen, within } from '@testing-library/angular';

describe('ControlActivitiesOutsourcedActivitiesComponent', () => {
  let fixture: ComponentFixture<ControlActivitiesOutsourcedActivitiesComponent>;
  let component: ControlActivitiesOutsourcedActivitiesComponent;
  let store: RequestTaskStore;

  const activatedRouteStub = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<EmpTaskPayload>> = {
    saveSubtask: jest.fn().mockReturnValue(of({})),
  };

  const taskServiceSpy = jest.spyOn(taskServiceMock, 'saveSubtask');

  const createComponent = () => {
    fixture = TestBed.createComponent(ControlActivitiesOutsourcedActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlActivitiesOutsourcedActivitiesComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        ...taskProviders,
      ],
    }).compileComponents();
  });

  describe('for new emission source', () => {
    beforeEach(async () => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(mockEmpIssuanceSubmitRequestTask);
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display all HTMLElements and form with 0 errors', () => {
      expect(screen.getByRole('heading', { name: 'Outsourced Activities' })).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
      expect(screen.queryByRole('alert', { name: 'There is a problem' })).not.toBeInTheDocument();
      expect(screen.getAllByRole('radio')).toHaveLength(2);
    });

    it('should display error on empty form submit', () => {
      screen.getByRole('button', { name: 'Continue' }).click();
      fixture.detectChanges();
      const summaryBox = screen.queryByRole('alert', { name: 'There is a problem' });
      expect(summaryBox).toBeInTheDocument();

      const summaryErrors = within(summaryBox).getAllByRole('link');
      expect(summaryErrors).toHaveLength(1);
      expect(summaryErrors.map((anchor) => anchor.textContent.trim())).toEqual([
        'Select ‘Yes’, if you want to define outsourced activities',
      ]);
    });
  });

  describe('for existing emission source', () => {
    beforeEach(async () => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          {
            controlActivities: mockEmpControlActivities,
          },
          { sources: TaskItemStatus.IN_PROGRESS },
        ),
      );
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display all HTMLElements and form with 0 errors', () => {
      expect(screen.getByRole('heading', { name: 'Outsourced Activities' })).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
      expect(screen.queryByRole('alert', { name: 'There is a problem' })).not.toBeInTheDocument();
      expect(screen.getAllByRole('radio')).toHaveLength(2);
    });

    it('should edit and submit a valid form without `factors` section', async () => {
      const input = screen.getByRole('radio', { name: /no/i });
      fireEvent.click(input);

      screen.getByRole('button', { name: 'Continue' }).click();
      fixture.detectChanges();

      expect(taskServiceSpy).toHaveBeenCalledWith(
        CONTROL_ACTIVITIES_SUB_TASK,
        ControlActivitiesWizardStep.OUTSOURCED_ACTIVITIES,
        activatedRouteStub,
        {
          exist: false,
        },
      );
    });

    it('should submit a valid form', async () => {
      screen.getByRole('button', { name: 'Continue' }).click();
      fixture.detectChanges();

      expect(screen.queryByRole('alert', { name: 'There is a problem' })).not.toBeInTheDocument();
      expect(taskServiceSpy).toHaveBeenCalledWith(
        CONTROL_ACTIVITIES_SUB_TASK,
        ControlActivitiesWizardStep.OUTSOURCED_ACTIVITIES,
        activatedRouteStub,
        mockEmpControlActivities.outsourcedActivities,
      );
    });
  });
});

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
import { ControlActivitiesQualityAssuranceComponent } from '@requests/common/emp/subtasks/control-activities/control-activities-quality-assurance/control-activities-quality-assurance.component';
import {
  mockEmpControlActivities,
  mockEmpIssuanceSubmitRequestTask,
  mockEmpProcedureForm,
  mockStateBuild,
} from '@requests/common/emp/testing/mock-data';
import { taskProviders } from '@requests/common/task.providers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { fireEvent, screen, within } from '@testing-library/angular';

describe('ControlActivitiesQualityAssuranceComponent', () => {
  let fixture: ComponentFixture<ControlActivitiesQualityAssuranceComponent>;
  let component: ControlActivitiesQualityAssuranceComponent;
  let store: RequestTaskStore;

  const activatedRouteStub = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<EmpTaskPayload>> = {
    saveSubtask: jest.fn().mockReturnValue(of({})),
  };

  const taskServiceSpy = jest.spyOn(taskServiceMock, 'saveSubtask');

  const createComponent = () => {
    fixture = TestBed.createComponent(ControlActivitiesQualityAssuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlActivitiesQualityAssuranceComponent],
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
      expect(
        screen.getByRole('heading', { name: 'Quality assurance and reliability of information technology' }),
      ).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
      expect(screen.queryByRole('alert', { name: 'There is a problem' })).not.toBeInTheDocument();
      expect(screen.getAllByRole('textbox')).toHaveLength(6);
    });

    it('should display error on empty form submit', () => {
      screen.getByRole('button', { name: 'Continue' }).click();
      fixture.detectChanges();
      const summaryBox = screen.queryByRole('alert', { name: 'There is a problem' });
      expect(summaryBox).toBeInTheDocument();

      const summaryErrors = within(summaryBox).getAllByRole('link');
      expect(summaryErrors).toHaveLength(4);
      expect(summaryErrors.map((anchor) => anchor.textContent.trim())).toEqual([
        'Enter a procedure reference',
        'Enter a description for the procedure',
        'Enter the name of the person or position responsible for this procedure',
        'Enter the location where records are kept',
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
          { controlActivities: TaskItemStatus.IN_PROGRESS },
        ),
      );
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display all HTMLElements and form with 0 errors', () => {
      expect(
        screen.getByRole('heading', { name: 'Quality assurance and reliability of information technology' }),
      ).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
      expect(screen.queryByRole('alert', { name: 'There is a problem' })).not.toBeInTheDocument();
      expect(screen.getAllByRole('textbox')).toHaveLength(6);
    });

    it('should edit and submit a valid form', async () => {
      const input = screen.getByRole('textbox', { name: /version/i });
      fireEvent.input(input, {
        target: {
          value: 'test new value',
        },
      });

      screen.getByRole('button', { name: 'Continue' }).click();
      fixture.detectChanges();

      expect(taskServiceSpy).toHaveBeenCalledWith(
        CONTROL_ACTIVITIES_SUB_TASK,
        ControlActivitiesWizardStep.QUALITY_ASSURANCE,
        activatedRouteStub,
        {
          ...mockEmpProcedureForm,
          version: 'test new value',
        },
      );
    });

    it('should submit a valid form', async () => {
      screen.getByRole('button', { name: 'Continue' }).click();
      fixture.detectChanges();

      expect(screen.queryByRole('alert', { name: 'There is a problem' })).not.toBeInTheDocument();
      expect(taskServiceSpy).toHaveBeenCalledWith(
        CONTROL_ACTIVITIES_SUB_TASK,
        ControlActivitiesWizardStep.QUALITY_ASSURANCE,
        activatedRouteStub,
        mockEmpProcedureForm,
      );
    });
  });
});

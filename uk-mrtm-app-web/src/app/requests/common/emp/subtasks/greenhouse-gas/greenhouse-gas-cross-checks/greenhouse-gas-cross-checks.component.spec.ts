import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { GREENHOUSE_GAS_SUB_TASK, GreenhouseGasWizardStep } from '@requests/common/emp/subtasks/greenhouse-gas';
import { GreenhouseGasCrossChecksComponent } from '@requests/common/emp/subtasks/greenhouse-gas/greenhouse-gas-cross-checks/greenhouse-gas-cross-checks.component';
import {
  mockEmpIssuanceSubmitRequestTask,
  mockEmpProcedureForm,
  mockGreenhouseGas,
  mockStateBuild,
} from '@requests/common/emp/testing/emp-data.mock';
import { taskProviders } from '@requests/common/task.providers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { fireEvent, screen, within } from '@testing-library/angular';

describe('GreenhouseGasCrossChecksComponent', () => {
  let fixture: ComponentFixture<GreenhouseGasCrossChecksComponent>;
  let component: GreenhouseGasCrossChecksComponent;
  let store: RequestTaskStore;

  const activatedRouteStub = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<EmpTaskPayload>> = {
    saveSubtask: jest.fn().mockReturnValue(of({})),
  };

  const taskServiceSpy = jest.spyOn(taskServiceMock, 'saveSubtask');

  const createComponent = () => {
    fixture = TestBed.createComponent(GreenhouseGasCrossChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreenhouseGasCrossChecksComponent],
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
      expect(screen.getByRole('heading', { name: 'Bunkering cross-checks' })).toBeTruthy();
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
            greenhouseGas: mockGreenhouseGas,
          },
          { greenhouseGas: TaskItemStatus.IN_PROGRESS },
        ),
      );
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display all HTMLElements and form with 0 errors', () => {
      expect(screen.getByRole('heading', { name: 'Bunkering cross-checks' })).toBeTruthy();
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
        GREENHOUSE_GAS_SUB_TASK,
        GreenhouseGasWizardStep.CROSS_CHECK,
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
        GREENHOUSE_GAS_SUB_TASK,
        GreenhouseGasWizardStep.CROSS_CHECK,
        activatedRouteStub,
        mockEmpProcedureForm,
      );
    });
  });
});

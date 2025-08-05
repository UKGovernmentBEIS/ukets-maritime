import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EMISSION_SOURCES_SUB_TASK, EmissionSourcesWizardStep } from '@requests/common/emp/subtasks/emission-sources';
import { EmissionSourcesCompletionComponent } from '@requests/common/emp/subtasks/emission-sources/emission-sources-completion';
import { EmissionSourcesFactorsComponent } from '@requests/common/emp/subtasks/emission-sources/emission-sources-factors/emission-sources-factors.component';
import {
  mockEmpEmissionSources,
  mockEmpIssuanceSubmitRequestTask,
  mockStateBuild,
} from '@requests/common/emp/testing/mock-data';
import { taskProviders } from '@requests/common/task.providers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { fireEvent, screen, within } from '@testing-library/angular';

describe('EmissionSourceFactorsComponent', () => {
  let fixture: ComponentFixture<EmissionSourcesFactorsComponent>;
  let component: EmissionSourcesFactorsComponent;
  let store: RequestTaskStore;

  const activatedRouteStub = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<EmpTaskPayload>> = {
    saveSubtask: jest.fn().mockReturnValue(of({})),
  };

  const taskServiceSpy = jest.spyOn(taskServiceMock, 'saveSubtask');

  const createComponent = () => {
    fixture = TestBed.createComponent(EmissionSourcesFactorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmissionSourcesCompletionComponent],
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
      expect(screen.getByRole('heading', { name: 'Determination of emission factors' })).toBeTruthy();
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
        'Select if you are using default values for all emissions factors',
      ]);
    });
  });

  describe('for existing emission source', () => {
    beforeEach(async () => {
      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockStateBuild(
          {
            sources: mockEmpEmissionSources,
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
      expect(screen.getByRole('heading', { name: 'Determination of emission factors' })).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
      expect(screen.queryByRole('alert', { name: 'There is a problem' })).not.toBeInTheDocument();
      expect(screen.getAllByRole('radio')).toHaveLength(2);
    });

    it('should edit and submit a valid form without `factors` section', async () => {
      const input = screen.getByRole('radio', { name: /yes/i });
      fireEvent.click(input);

      screen.getByRole('button', { name: 'Continue' }).click();
      fixture.detectChanges();

      expect(taskServiceSpy).toHaveBeenCalledWith(
        EMISSION_SOURCES_SUB_TASK,
        EmissionSourcesWizardStep.EMISSION_FACTORS,
        activatedRouteStub,
        {
          exist: true,
        },
      );
    });

    it('should submit a valid form', async () => {
      screen.getByRole('button', { name: 'Continue' }).click();
      fixture.detectChanges();

      expect(screen.queryByRole('alert', { name: 'There is a problem' })).not.toBeInTheDocument();
      expect(taskServiceSpy).toHaveBeenCalledWith(
        EMISSION_SOURCES_SUB_TASK,
        EmissionSourcesWizardStep.EMISSION_FACTORS,
        activatedRouteStub,
        mockEmpEmissionSources.emissionFactors,
      );
    });
  });
});

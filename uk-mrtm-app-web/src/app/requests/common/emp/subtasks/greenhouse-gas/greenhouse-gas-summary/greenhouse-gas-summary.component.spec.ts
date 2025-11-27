import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import {
  GREENHOUSE_GAS_SUB_TASK,
  GreenhouseGasSummaryComponent,
  GreenhouseGasWizardStep,
} from '@requests/common/emp/subtasks/greenhouse-gas';
import { greenhouseGasMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { mockGreenhouseGas, mockStateBuild } from '@requests/common/emp/testing/emp-data.mock';
import { taskProviders } from '@requests/common/task.providers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { screen } from '@testing-library/angular';

describe('GreenhouseGasSummaryComponent', () => {
  let fixture: ComponentFixture<GreenhouseGasSummaryComponent>;
  let component: GreenhouseGasSummaryComponent;
  let store: RequestTaskStore;

  const activatedRouteStub = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<unknown>> = {
    submitSubtask: jest.fn().mockReturnValue(of({})),
  };

  const taskServiceSpy = jest.spyOn(taskServiceMock, 'submitSubtask');

  const createComponent = () => {
    fixture = TestBed.createComponent(GreenhouseGasSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreenhouseGasSummaryComponent],
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
          greenhouseGas: mockGreenhouseGas,
        },
        {
          greenhouseGas: TaskItemStatus.IN_PROGRESS,
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
      greenhouseGasMap.fuel.title,
      greenhouseGasMap.crossChecks.title,
      greenhouseGasMap.information.title,
      greenhouseGasMap.qaEquipment.title,
      greenhouseGasMap.voyages.title,
    ]);

    expect([...new Set(screen.getAllByRole('term').map((term) => term.textContent.trim()))]).toEqual([
      'Procedure reference',
      'Procedure version',
      'Description of procedure',
      'Name of person or position responsible for this procedure',
      'Location where records are kept',
      'Name of IT system used',
    ]);
  });

  it('should submit subtask', () => {
    screen.getByRole('button', { name: 'Confirm and continue' }).click();

    expect(taskServiceSpy).toHaveBeenCalledWith(
      GREENHOUSE_GAS_SUB_TASK,
      GreenhouseGasWizardStep.SUMMARY,
      activatedRouteStub,
    );
  });
});

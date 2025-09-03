import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { EMISSION_SOURCES_SUB_TASK, EmissionSourcesWizardStep } from '@requests/common/emp/subtasks/emission-sources';
import { EmissionSourcesSummaryComponent } from '@requests/common/emp/subtasks/emission-sources/emission-sources-summary/emission-sources-summary.component';
import { emissionSourcesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { mockEmpEmissionSources, mockStateBuild } from '@requests/common/emp/testing/mock-data';
import { taskProviders } from '@requests/common/task.providers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { screen } from '@testing-library/angular';

describe('EmissionSourcesSummaryComponent', () => {
  let fixture: ComponentFixture<EmissionSourcesSummaryComponent>;
  let component: EmissionSourcesSummaryComponent;
  let store: RequestTaskStore;

  const activatedRouteStub = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<unknown>> = {
    submitSubtask: jest.fn().mockReturnValue(of({})),
  };

  const taskServiceSpy = jest.spyOn(taskServiceMock, 'submitSubtask');

  const createComponent = () => {
    fixture = TestBed.createComponent(EmissionSourcesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmissionSourcesSummaryComponent],
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
          sources: mockEmpEmissionSources,
        },
        {
          sources: TaskItemStatus.IN_PROGRESS,
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
      emissionSourcesMap.listCompletion.title,
      emissionSourcesMap.emissionFactors.title,
      emissionSourcesMap.emissionCompliance.title,
    ]);

    expect([...new Set(screen.getAllByRole('term').map((term) => term.textContent.trim()))]).toEqual([
      'Procedure reference',
      'Procedure version',
      'Description of procedure',
      'Name of person or position responsible for this procedure',
      'Location where records are kept',
      'Name of IT system used',
      'Are you using default values for all emissions factors?',
      'Will you be making an emissions reduction claim as a result of the purchase and delivery of sustainable fuel?',
    ]);
  });

  it('should submit subtask', () => {
    screen.getByRole('button', { name: 'Confirm and continue' }).click();

    expect(taskServiceSpy).toHaveBeenCalledWith(
      EMISSION_SOURCES_SUB_TASK,
      EmissionSourcesWizardStep.SUMMARY,
      activatedRouteStub,
    );
  });
});

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, BasePage, MockType } from '@netz/common/testing';

import { EMISSION_SOURCES_SUB_TASK, EmissionSourcesWizardStep } from '@requests/common/emp/subtasks/emission-sources';
import { mockEmpEmissionSources, mockStateBuild } from '@requests/common/emp/testing/emp-data.mock';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { taskProviders } from '@requests/common/task.providers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { EmpReviewService } from '@requests/tasks/emp-review/services';
import { EmissionSourcesDecisionComponent } from '@requests/tasks/emp-review/subtasks/emission-sources';

describe('EmissionSourcesDecisionComponent', () => {
  let component: EmissionSourcesDecisionComponent;
  let fixture: ComponentFixture<EmissionSourcesDecisionComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const route = new ActivatedRouteStub();
  const taskService: MockType<EmpReviewService> = {
    saveReviewDecision: jest.fn().mockReturnValue(of({})),
  };
  const taskServiceSpy = jest.spyOn(taskService, 'saveReviewDecision');

  class Page extends BasePage<EmissionSourcesDecisionComponent> {
    get typeRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="type"]');
    }
  }

  const createComponent = () => {
    fixture = TestBed.createComponent(EmissionSourcesDecisionComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmissionSourcesDecisionComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: route },
        { provide: TaskService, useValue: taskService },
        ...taskProviders,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(RequestTaskStore);
    store.setState(mockStateBuild({ sources: mockEmpEmissionSources }, { sources: TaskItemStatus.IN_PROGRESS }));
    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.summariesContents).toEqual([
      'Procedure reference',
      'test reference',
      'Change',
      'Procedure version',
      'Not provided',
      'Change',
      'Description of procedure',
      'test description',
      'Change',
      'Name of person or position responsible for this procedure',
      'test responsiblePersonOrPosition',
      'Change',
      'Location where records are kept',
      'test recordsLocation',
      'Change',
      'Name of IT system used',
      'Not provided',
      'Change',
      'Are you using default values for all emissions factors?',
      'No',
      'Change',
      'Procedure reference',
      'test reference',
      'Change',
      'Procedure version',
      'Not provided',
      'Change',
      'Description of procedure',
      'test description',
      'Change',
      'Name of person or position responsible for this procedure',
      'test responsiblePersonOrPosition',
      'Change',
      'Location where records are kept',
      'test recordsLocation',
      'Change',
      'Name of IT system used',
      'Not provided',
      'Change',
      'Will you be making an emissions reduction claim relating to eligible fuels?',
      'Yes',
      'Change',
      'Procedure reference',
      'test reference',
      'Change',
      'Procedure version',
      'Not provided',
      'Change',
      'Description of procedure',
      'test description',
      'Change',
      'Name of person or position responsible for this procedure',
      'test responsiblePersonOrPosition',
      'Change',
      'Location where records are kept',
      'test recordsLocation',
      'Change',
      'Name of IT system used',
      'Not provided',
      'Change',
    ]);
  });

  it('should submit subtask', () => {
    page.submitButton.click();

    fixture.detectChanges();
    expect(page.errorSummary).toBeTruthy();
    expect(page.errorSummaryListContents).toEqual(['Select a decision for this review group']);

    page.typeRadios[0].click();
    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith(
      EMISSION_SOURCES_SUB_TASK,
      EmissionSourcesWizardStep.DECISION,
      route,
      { notes: null, type: 'ACCEPTED' },
      subtaskReviewGroupMap[EMISSION_SOURCES_SUB_TASK],
    );
  });
});

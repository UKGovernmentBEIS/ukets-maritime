import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, BasePage, MockType } from '@netz/common/testing';

import { TaskItemStatus } from '@requests/common';
import {
  CONTROL_ACTIVITIES_SUB_TASK,
  ControlActivitiesWizardStep,
} from '@requests/common/emp/subtasks/control-activities';
import { mockEmpControlActivities, mockStateBuild } from '@requests/common/emp/testing/emp-data.mock';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { taskProviders } from '@requests/common/task.providers';
import { EmpVariationReviewService } from '@requests/tasks/emp-variation-review/services';
import { ControlActivitiesVariationReviewDecisionComponent } from '@requests/tasks/emp-variation-review/subtasks/control-activities';

describe('ControlActivitiesVariationReviewDecisionComponent', () => {
  let component: ControlActivitiesVariationReviewDecisionComponent;
  let fixture: ComponentFixture<ControlActivitiesVariationReviewDecisionComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const route = new ActivatedRouteStub();
  const taskService: MockType<EmpVariationReviewService> = {
    saveReviewDecision: jest.fn().mockReturnValue(of({})),
  };
  const taskServiceSpy = jest.spyOn(taskService, 'saveReviewDecision');

  class Page extends BasePage<ControlActivitiesVariationReviewDecisionComponent> {
    get typeRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="type"]');
    }
  }

  const createComponent = () => {
    fixture = TestBed.createComponent(ControlActivitiesVariationReviewDecisionComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlActivitiesVariationReviewDecisionComponent],
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
    store.setState(
      mockStateBuild(
        { controlActivities: mockEmpControlActivities },
        { controlActivities: TaskItemStatus.IN_PROGRESS },
      ),
    );
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
      'Are any of your activities outsourced?',
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
      CONTROL_ACTIVITIES_SUB_TASK,
      ControlActivitiesWizardStep.DECISION,
      route,
      { notes: null, type: 'ACCEPTED', variationScheduleItems: [] },
      subtaskReviewGroupMap[CONTROL_ACTIVITIES_SUB_TASK],
    );
  });
});

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, BasePage, MockType } from '@netz/common/testing';

import { ABBREVIATIONS_SUB_TASK, AbbreviationsWizardStep } from '@requests/common/emp/subtasks/abbreviations';
import { mockEmpAbbreviations, mockStateBuild } from '@requests/common/emp/testing/mock-data';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { taskProviders } from '@requests/common/task.providers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { EmpReviewService } from '@requests/tasks/emp-review/services';
import { AbbreviationsDecisionComponent } from '@requests/tasks/emp-review/subtasks/abbreviations';

describe('AbbreviationsDecisionComponent', () => {
  let component: AbbreviationsDecisionComponent;
  let fixture: ComponentFixture<AbbreviationsDecisionComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const route = new ActivatedRouteStub();
  const taskService: MockType<EmpReviewService> = {
    saveReviewDecision: jest.fn().mockReturnValue(of({})),
  };
  const taskServiceSpy = jest.spyOn(taskService, 'saveReviewDecision');

  class Page extends BasePage<AbbreviationsDecisionComponent> {
    get typeRadios() {
      return this.queryAll<HTMLInputElement>('input[name$="type"]');
    }
  }

  const createComponent = () => {
    fixture = TestBed.createComponent(AbbreviationsDecisionComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbbreviationsDecisionComponent],
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
      mockStateBuild({ abbreviations: mockEmpAbbreviations }, { abbreviations: TaskItemStatus.IN_PROGRESS }),
    );
    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.summariesContents).toEqual([
      'Are you using any abbreviations or terminology in your application which need explanation?',
      'Yes',
      'Change',
      'Abbreviation, acronym or terminology',
      'Abbreviation1',
      'Change',
      'Definition',
      'Definition1',
      'Change',
      'Abbreviation, acronym or terminology',
      'Abbreviation2',
      'Change',
      'Definition',
      'Definition2',
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
      ABBREVIATIONS_SUB_TASK,
      AbbreviationsWizardStep.DECISION,
      route,
      { notes: null, type: 'ACCEPTED' },
      subtaskReviewGroupMap[ABBREVIATIONS_SUB_TASK],
    );
  });
});

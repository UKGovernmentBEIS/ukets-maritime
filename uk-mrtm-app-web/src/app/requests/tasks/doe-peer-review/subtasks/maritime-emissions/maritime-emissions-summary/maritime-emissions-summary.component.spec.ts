import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { AuthStore } from '@netz/common/auth';
import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, BasePage, MockType } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import {
  mockDoePeerReviewMaritimeEmissions,
  mockStateBuild,
} from '@requests/tasks/doe-peer-review/testing/doe-peer-review-data.mock';
import { MaritimeEmissionsSummaryComponent } from '@requests/tasks/doe-submit/subtasks/maritime-emissions/maritime-emissions-summary';

describe('MaritimeEmissionsSummaryComponent', () => {
  let component: MaritimeEmissionsSummaryComponent;
  let fixture: ComponentFixture<MaritimeEmissionsSummaryComponent>;
  let authStore: AuthStore;
  let page: Page;
  let store: RequestTaskStore;
  const taskServiceMock: MockType<TaskService<any>> = {};

  class Page extends BasePage<MaritimeEmissionsSummaryComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaritimeEmissionsSummaryComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        ...taskProviders,
      ],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    authStore.setUserState({
      ...authStore.state.userState,
      roleType: 'REGULATOR',
      userId: 'opTestId',
      status: 'ENABLED',
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockStateBuild({ maritimeEmissions: mockDoePeerReviewMaritimeEmissions }));

    fixture = TestBed.createComponent(MaritimeEmissionsSummaryComponent);
    page = new Page(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all html elements', () => {
    expect(page.heading1.textContent).toEqual('Check your answers');
    expect(page.summariesContents).toEqual([
      'Why are you determining the maritime emissions or emissions figure for surrender?',
      'Correcting a non-material misstatement',
      'Notice text',
      'test notice text',
      'Further details',
      'test further details',
      'Select whether you are determining maritime emissions or only the emissions figure for surrender',
      'Maritime emissions and emissions figure for surrender',
      'Total maritime emissions',
      '1 tCO2e',
      'Less Northern Ireland surrender deduction',
      '2 tCO2e',
      'Emissions figure for surrender',
      '12 tCO2e',
      'How have you calculated the emissions?',
      'test another data source',
      'Supporting documents',
      'Not provided',
      'Do you need to charge the operator a fee?',
      'Yes',
      'Billable hours',
      '100 hours',
      'Hourly rate',
      '£56.23 per hour',
      'Payment due date',
      '31 October 2050',
      'Regulator comments',
      'test regulator comments',
      'Total operator fee',
      '£5,623.00',
      '',
    ]);
  });
});

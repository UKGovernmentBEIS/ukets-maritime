import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { actionProviders } from '@requests/common/action.providers';
import { controlActivitiesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { mockSubmittedStateBuild } from '@requests/common/emp/testing/emp-action-data.mock';
import { mockEmpControlActivities } from '@requests/common/emp/testing/emp-data.mock';
import { ControlActivitiesSubmittedComponent } from '@requests/timeline/emp-submitted/subtasks/control-activities';
import { screen } from '@testing-library/angular';

describe('ControlActivitiesSubmittedComponent', () => {
  let fixture: ComponentFixture<ControlActivitiesSubmittedComponent>;
  let component: ControlActivitiesSubmittedComponent;
  let store: RequestActionStore;

  const activatedRouteStub = new ActivatedRouteStub();

  const createComponent = () => {
    fixture = TestBed.createComponent(ControlActivitiesSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlActivitiesSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }, ...actionProviders],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState(
      mockSubmittedStateBuild({
        controlActivities: mockEmpControlActivities,
      }),
    );
    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(screen.getAllByRole('heading')[0].textContent).toEqual('Control activities');

    const summarySections = screen
      .getAllByRole('heading')
      .slice(1)
      .map((section) => section.textContent);

    expect(summarySections).toEqual([
      controlActivitiesMap.qualityAssurance.title,
      controlActivitiesMap.internalReviews.title,
      controlActivitiesMap.corrections.title,
      controlActivitiesMap.outsourcedActivities.title,
      controlActivitiesMap.documentation.title,
    ]);

    expect([...new Set(screen.getAllByRole('term').map((term) => term.textContent.trim()))]).toEqual([
      'Procedure reference',
      'Procedure version',
      'Description of procedure',
      'Name of person or position responsible for this procedure',
      'Location where records are kept',
      'Name of IT system used',
      'Are any of your activities outsourced?',
    ]);
  });
});

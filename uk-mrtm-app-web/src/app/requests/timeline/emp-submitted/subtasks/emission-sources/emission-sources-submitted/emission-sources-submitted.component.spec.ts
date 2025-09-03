import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { emissionSourcesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { mockSubmittedStateBuild } from '@requests/common/emp/testing/mock-action-data';
import { mockEmpEmissionSources } from '@requests/common/emp/testing/mock-data';
import { taskProviders } from '@requests/common/task.providers';
import { EmissionSourcesSubmittedComponent } from '@requests/timeline/emp-submitted/subtasks/emission-sources';
import { screen } from '@testing-library/angular';

describe('EmissionSourcesSubmittedComponent', () => {
  let fixture: ComponentFixture<EmissionSourcesSubmittedComponent>;
  let component: EmissionSourcesSubmittedComponent;
  let store: RequestActionStore;

  const activatedRouteStub = new ActivatedRouteStub();

  const createComponent = () => {
    fixture = TestBed.createComponent(EmissionSourcesSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmissionSourcesSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }, ...taskProviders],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState(
      mockSubmittedStateBuild({
        sources: mockEmpEmissionSources,
      }),
    );
    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(screen.getAllByRole('heading')[0].textContent).toEqual(
      'Procedures related to emissions sources and emissions factors',
    );

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
});

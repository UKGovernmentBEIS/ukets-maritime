import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestActionStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { actionProviders } from '@requests/common/action.providers';
import { greenhouseGasMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { mockSubmittedStateBuild } from '@requests/common/emp/testing/emp-action-data.mock';
import { mockGreenhouseGas } from '@requests/common/emp/testing/emp-data.mock';
import { GreenhouseGasSubmittedComponent } from '@requests/timeline/emp-submitted/subtasks/greenhouse-gas';
import { screen } from '@testing-library/angular';

describe('GreenhouseGasSubmittedComponent', () => {
  let fixture: ComponentFixture<GreenhouseGasSubmittedComponent>;
  let component: GreenhouseGasSubmittedComponent;
  let store: RequestActionStore;

  const activatedRouteStub = new ActivatedRouteStub();

  const createComponent = () => {
    fixture = TestBed.createComponent(GreenhouseGasSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreenhouseGasSubmittedComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }, ...actionProviders],
    }).compileComponents();

    store = TestBed.inject(RequestActionStore);
    store.setState(
      mockSubmittedStateBuild({
        greenhouseGas: mockGreenhouseGas,
      }),
    );
    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(screen.getAllByRole('heading')[0].textContent).toEqual(
      'Procedures related to the monitoring of greenhouse gas emissions and fuel consumption',
    );

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
});

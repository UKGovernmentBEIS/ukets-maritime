import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { AerFetchShipsFromEmpComponent } from '@requests/common/aer/subtasks/aer-emissions/aer-fetch-ships-from-emp/aer-fetch-ships-from-emp.component';
import { aerEmissionsMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import { taskProviders } from '@requests/common/task.providers';
import { screen } from '@testing-library/angular';

describe('AerFetchShipsFromEmpComponent', () => {
  let component: AerFetchShipsFromEmpComponent;
  let fixture: ComponentFixture<AerFetchShipsFromEmpComponent>;
  const taskService: MockType<any> = {
    fetchShipsFromEMP: jest.fn().mockReturnValue(of({})),
  };

  const taskServiceSpy = jest.spyOn(taskService, 'fetchShipsFromEMP');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerFetchShipsFromEmpComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub({}) },
        { provide: TaskService, useValue: taskService },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AerFetchShipsFromEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    const heading = screen.getByRole('heading');
    const warnText = screen.getByRole('strong');
    const submitButton = screen.getByRole('button');
    const returnLink = screen.getByRole('link', { name: /Return to:/ });

    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toEqual(aerEmissionsMap.fetchFromEMP.title);

    expect(warnText).toBeInTheDocument();
    expect(warnText.textContent).toEqual(
      'If you import the ships from the Emissions Monitoring Plan (EMP), all of the data that has been entered will be replaced.',
    );

    expect(submitButton).toBeInTheDocument();
    expect(submitButton.textContent).toEqual('Yes, import ships from EMP');

    expect(returnLink).toBeInTheDocument();
    expect(returnLink.textContent).toEqual('Return to: Add ships and emission details');
  });

  it('should trigger fetch ships from EMP', () => {
    const submitButton = screen.getByRole('button');
    submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledTimes(1);
  });
});

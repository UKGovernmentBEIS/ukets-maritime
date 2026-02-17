import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, BasePage, MockType } from '@netz/common/testing';

import { AerAggregatedDataFuelConsumptionComponent } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-fuel-consumption/aer-aggregated-data-fuel-consumption.component';
import { taskProviders } from '@requests/common/task.providers';

describe('AerAggregatedDataFuelConsumptionComponent', () => {
  class Page extends BasePage<AerAggregatedDataFuelConsumptionComponent> {}
  let component: AerAggregatedDataFuelConsumptionComponent;
  let fixture: ComponentFixture<AerAggregatedDataFuelConsumptionComponent>;
  let page: Page;
  const taskServiceMock: MockType<TaskService<unknown>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerAggregatedDataFuelConsumptionComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AerAggregatedDataFuelConsumptionComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements and form with 0 errors', () => {
    expect(page.errorSummary).toBeFalsy();
    expect(page.heading1).toBeTruthy();
    expect(page.heading1.textContent).toEqual('Total amount of each fuel type consumed');

    expect(page.submitButton).toBeTruthy();
    expect(page.query('a').textContent).toEqual('Return to: Aggregated data for ships');
  });

  it('should display error on empty form submit', () => {
    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeTruthy();
    expect(page.errorSummaryListContents.length).toEqual(2);
    expect(page.errorSummaryListContents).toEqual(['Select a fuel type', 'Enter the total consumption of fuel used']);
  });
});

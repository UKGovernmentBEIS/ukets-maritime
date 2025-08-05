import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, BasePage, MockType } from '@netz/common/testing';

import { aerAggregatedDataSubtasksListMap } from '@requests/common/aer/subtasks/aer-aggregated-data';
import { AerAggregatedDataListComponent } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-list/aer-aggregated-data-list.component';
import { taskProviders } from '@requests/common/task.providers';
import { screen } from '@testing-library/angular';

describe('AerAggregatedDataListComponent', () => {
  let component: AerAggregatedDataListComponent;
  let fixture: ComponentFixture<AerAggregatedDataListComponent>;
  let page: Page;
  let store: RequestTaskStore;
  const taskServiceMock: MockType<TaskService<any>> = {};

  class Page extends BasePage<AerAggregatedDataListComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerAggregatedDataListComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState({
      ...mockRequestTask,
      requestTaskItem: {
        ...mockRequestTask.requestTaskItem,
        requestTask: {
          ...mockRequestTask.requestTaskItem.requestTask,
          type: 'AER_APPLICATION_SUBMIT',
          payload: {
            payloadType: 'AER_APPLICATION_SUBMIT_PAYLOAD',
          },
        },
      },
    });
    fixture = TestBed.createComponent(AerAggregatedDataListComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.heading1.textContent).toEqual(aerAggregatedDataSubtasksListMap.title);
    expect(page.heading3.textContent).toEqual('Aggregated data of all ships');
    expect(screen.getByRole('link', { name: /Return to:/ })?.textContent).toEqual(
      'Return to: Complete annual emissions report',
    );
    expect(screen.getAllByRole('columnheader').map((column) => column.textContent.trim())).toEqual([
      'IMO number',
      'Ship name',
      'Total ship emissions (tCO2e)',
      'Emissions figure for surrender  (tCO2e)',
      'Status',
    ]);

    expect(screen.getByRole('cell')?.textContent?.trim()).toEqual('No items to display');
  });
});

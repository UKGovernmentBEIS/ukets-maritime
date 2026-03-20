import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { MockType } from '@netz/common/testing';

import { AerAggregatedDataListSummaryComponent } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-list-summary/aer-aggregated-data-list-summary.component';
import { taskProviders } from '@requests/common/task.providers';

describe('AerAggregatedDataListSummaryComponent', () => {
  let component: AerAggregatedDataListSummaryComponent;
  let fixture: ComponentFixture<AerAggregatedDataListSummaryComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerAggregatedDataListSummaryComponent],
      providers: [{ provide: TaskService, useValue: taskServiceMock }, provideRouter([]), ...taskProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(AerAggregatedDataListSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

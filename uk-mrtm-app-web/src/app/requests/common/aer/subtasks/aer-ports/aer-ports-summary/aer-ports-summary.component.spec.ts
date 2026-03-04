import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { MockType } from '@netz/common/testing';

import { AerPortsSummaryComponent } from '@requests/common/aer/subtasks/aer-ports/aer-ports-summary';
import { taskProviders } from '@requests/common/task.providers';

describe('AerPortsSummaryComponent', () => {
  let component: AerPortsSummaryComponent;
  let fixture: ComponentFixture<AerPortsSummaryComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerPortsSummaryComponent],
      providers: [{ provide: TaskService, useValue: taskServiceMock }, provideRouter([]), ...taskProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(AerPortsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { MockType } from '@netz/common/testing';

import { AerVoyagesSummaryComponent } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages-summary/aer-voyages-summary.component';
import { taskProviders } from '@requests/common/task.providers';

describe('AerVoyagesSummaryComponent', () => {
  let component: AerVoyagesSummaryComponent;
  let fixture: ComponentFixture<AerVoyagesSummaryComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerVoyagesSummaryComponent],
      providers: [provideRouter([]), { provide: TaskService, useValue: taskServiceMock }, ...taskProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(AerVoyagesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

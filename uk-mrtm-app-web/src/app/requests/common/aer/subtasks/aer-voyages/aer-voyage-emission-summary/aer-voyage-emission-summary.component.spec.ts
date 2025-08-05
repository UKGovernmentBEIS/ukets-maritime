import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { AerVoyageEmissionSummaryComponent } from '@requests/common/aer/subtasks/aer-voyages/aer-voyage-emission-summary/aer-voyage-emission-summary.component';
import { taskProviders } from '@requests/common/task.providers';

describe('AerVoyageEmissionSummaryComponent', () => {
  let component: AerVoyageEmissionSummaryComponent;
  let fixture: ComponentFixture<AerVoyageEmissionSummaryComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerVoyageEmissionSummaryComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AerVoyageEmissionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { AerPortsListComponent } from '@requests/common/aer/subtasks/aer-ports/aer-ports-list/aer-ports-list.component';
import { taskProviders } from '@requests/common/task.providers';

describe('AerPortsListComponent', () => {
  let component: AerPortsListComponent;
  let fixture: ComponentFixture<AerPortsListComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerPortsListComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AerPortsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

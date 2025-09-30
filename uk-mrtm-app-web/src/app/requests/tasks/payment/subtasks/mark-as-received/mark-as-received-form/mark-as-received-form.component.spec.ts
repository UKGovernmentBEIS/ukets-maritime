import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import { MarkAsReceivedFormComponent } from '@requests/tasks/payment/subtasks/mark-as-received/mark-as-received-form';

describe('MarkAsReceivedFormComponent', () => {
  let component: MarkAsReceivedFormComponent;
  let fixture: ComponentFixture<MarkAsReceivedFormComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkAsReceivedFormComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkAsReceivedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

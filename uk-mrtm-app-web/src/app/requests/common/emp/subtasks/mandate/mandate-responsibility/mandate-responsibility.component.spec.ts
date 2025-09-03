import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { MandateResponsibilityComponent } from '@requests/common/emp/subtasks/mandate/mandate-responsibility/mandate-responsibility.component';
import { taskProviders } from '@requests/common/task.providers';

describe('MandateResponsibilityComponent', () => {
  let component: MandateResponsibilityComponent;
  let fixture: ComponentFixture<MandateResponsibilityComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandateResponsibilityComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: new ActivatedRouteStub(),
        },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MandateResponsibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

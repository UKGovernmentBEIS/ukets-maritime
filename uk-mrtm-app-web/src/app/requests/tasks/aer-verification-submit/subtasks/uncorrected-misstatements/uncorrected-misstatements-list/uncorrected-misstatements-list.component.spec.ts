import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import { UncorrectedMisstatementsListComponent } from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-misstatements/uncorrected-misstatements-list/uncorrected-misstatements-list.component';

describe('UncorrectedMisstatementsListComponent', () => {
  let component: UncorrectedMisstatementsListComponent;
  let fixture: ComponentFixture<UncorrectedMisstatementsListComponent>;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedMisstatementsListComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedMisstatementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

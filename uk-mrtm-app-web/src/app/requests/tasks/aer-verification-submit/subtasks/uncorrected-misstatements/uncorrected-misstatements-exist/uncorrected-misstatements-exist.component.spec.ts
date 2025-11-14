import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import { UncorrectedMisstatementsExistComponent } from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-misstatements/uncorrected-misstatements-exist/uncorrected-misstatements-exist.component';

describe('UncorrectedMisstatementsExistComponent', () => {
  let component: UncorrectedMisstatementsExistComponent;
  let fixture: ComponentFixture<UncorrectedMisstatementsExistComponent>;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedMisstatementsExistComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedMisstatementsExistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

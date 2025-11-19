import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { UncorrectedMisstatementsItemFormComponent } from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-misstatements/uncorrected-misstatements-item-form/uncorrected-misstatements-item-form.component';

describe('UncorrectedMisstatementsItemFormComponent', () => {
  let component: UncorrectedMisstatementsItemFormComponent;
  let fixture: ComponentFixture<UncorrectedMisstatementsItemFormComponent>;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedMisstatementsItemFormComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedMisstatementsItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

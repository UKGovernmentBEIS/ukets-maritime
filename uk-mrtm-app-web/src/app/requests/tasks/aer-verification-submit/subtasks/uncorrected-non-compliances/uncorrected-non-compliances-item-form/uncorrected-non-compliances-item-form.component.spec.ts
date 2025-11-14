import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import { UncorrectedNonCompliancesItemFormComponent } from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-compliances/uncorrected-non-compliances-item-form/uncorrected-non-compliances-item-form.component';

describe('UncorrectedNonCompliancesItemFormComponent', () => {
  let component: UncorrectedNonCompliancesItemFormComponent;
  let fixture: ComponentFixture<UncorrectedNonCompliancesItemFormComponent>;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedNonCompliancesItemFormComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedNonCompliancesItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

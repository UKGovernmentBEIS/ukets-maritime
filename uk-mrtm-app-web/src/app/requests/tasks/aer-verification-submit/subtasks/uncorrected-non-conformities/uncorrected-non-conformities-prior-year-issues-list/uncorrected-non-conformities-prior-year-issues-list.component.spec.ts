import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { taskProviders } from '@requests/common/task.providers';
import { UncorrectedNonConformitiesPriorYearIssuesListComponent } from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities-prior-year-issues-list/uncorrected-non-conformities-prior-year-issues-list.component';

describe('UncorrectedNonConformitiesPriorYearIssuesListComponent', () => {
  let component: UncorrectedNonConformitiesPriorYearIssuesListComponent;
  let fixture: ComponentFixture<UncorrectedNonConformitiesPriorYearIssuesListComponent>;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedNonConformitiesPriorYearIssuesListComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedNonConformitiesPriorYearIssuesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

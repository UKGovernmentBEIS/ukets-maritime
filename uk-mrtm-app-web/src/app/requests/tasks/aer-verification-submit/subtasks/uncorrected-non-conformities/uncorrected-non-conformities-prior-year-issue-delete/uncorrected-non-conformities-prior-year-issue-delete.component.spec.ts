import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { UncorrectedNonConformitiesPriorYearIssueDeleteComponent } from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities-prior-year-issue-delete/uncorrected-non-conformities-prior-year-issue-delete.component';

describe('UncorrectedNonConformitiesPriorYearIssueDeleteComponent', () => {
  let component: UncorrectedNonConformitiesPriorYearIssueDeleteComponent;
  let fixture: ComponentFixture<UncorrectedNonConformitiesPriorYearIssueDeleteComponent>;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedNonConformitiesPriorYearIssueDeleteComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedNonConformitiesPriorYearIssueDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

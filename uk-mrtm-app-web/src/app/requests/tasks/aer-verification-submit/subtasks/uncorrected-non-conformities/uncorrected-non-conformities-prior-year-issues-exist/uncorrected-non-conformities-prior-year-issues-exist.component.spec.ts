import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { UncorrectedNonConformitiesPriorYearIssuesExistComponent } from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities-prior-year-issues-exist/uncorrected-non-conformities-prior-year-issues-exist.component';

describe('UncorrectedNonConformitiesPriorYearIssuesExistComponent', () => {
  let component: UncorrectedNonConformitiesPriorYearIssuesExistComponent;
  let fixture: ComponentFixture<UncorrectedNonConformitiesPriorYearIssuesExistComponent>;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedNonConformitiesPriorYearIssuesExistComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedNonConformitiesPriorYearIssuesExistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

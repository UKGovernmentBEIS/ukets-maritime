import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, mockClass } from '@netz/common/testing';

import { AMENDS_NEEDED_GROUPS, RETURN_FOR_AMENDS_SERVICE } from '@requests/common/emp/return-for-amends';
import { taskProviders } from '@requests/common/task.providers';
import { AerReviewService } from '@requests/tasks/aer-review/services';
import { ReturnForChangesSummaryComponent } from '@requests/tasks/aer-review/subtasks/return-for-changes/return-for-changes-summary';

describe('ReturnForAmendsSummaryComponent', () => {
  let component: ReturnForChangesSummaryComponent;
  let fixture: ComponentFixture<ReturnForChangesSummaryComponent>;
  const route = new ActivatedRouteStub();
  const tasksService = mockClass(AerReviewService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnForChangesSummaryComponent],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: TaskService, useValue: tasksService },
        { provide: RETURN_FOR_AMENDS_SERVICE, useValue: tasksService },
        { provide: AMENDS_NEEDED_GROUPS, useValue: signal([]) },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnForChangesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, mockClass } from '@netz/common/testing';

import { AMENDS_NEEDED_GROUPS, RETURN_FOR_AMENDS_SERVICE } from '@requests/common/emp/return-for-amends';
import { ReturnForAmendsSummaryComponent } from '@requests/common/emp/return-for-amends/return-for-amends-summary/return-for-amends-summary.component';
import { taskProviders } from '@requests/common/task.providers';
import { EmpReviewService } from '@requests/tasks/emp-review/services';

describe('ReturnForAmendsSummaryComponent', () => {
  let component: ReturnForAmendsSummaryComponent;
  let fixture: ComponentFixture<ReturnForAmendsSummaryComponent>;
  const route = new ActivatedRouteStub();
  const tasksService = mockClass(EmpReviewService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnForAmendsSummaryComponent],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: TaskService, useValue: tasksService },
        { provide: RETURN_FOR_AMENDS_SERVICE, useValue: tasksService },
        { provide: AMENDS_NEEDED_GROUPS, useValue: signal([]) },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnForAmendsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

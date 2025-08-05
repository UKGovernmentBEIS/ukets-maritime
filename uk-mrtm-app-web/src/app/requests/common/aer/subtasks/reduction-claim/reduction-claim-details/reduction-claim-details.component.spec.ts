import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { ReductionClaimDetailsComponent } from '@requests/common/aer/subtasks/reduction-claim/reduction-claim-details';
import { taskProviders } from '@requests/common/task.providers';

describe('ReductionClaimDetailsComponent', () => {
  let component: ReductionClaimDetailsComponent;
  let fixture: ComponentFixture<ReductionClaimDetailsComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReductionClaimDetailsComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReductionClaimDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

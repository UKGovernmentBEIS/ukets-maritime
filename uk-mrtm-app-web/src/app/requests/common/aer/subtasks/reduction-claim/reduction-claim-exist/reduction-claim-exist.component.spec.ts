import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { ReductionClaimExistComponent } from '@requests/common/aer/subtasks/reduction-claim/reduction-claim-exist';
import { taskProviders } from '@requests/common/task.providers';

describe('ReductionClaimExistComponent', () => {
  let component: ReductionClaimExistComponent;
  let fixture: ComponentFixture<ReductionClaimExistComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReductionClaimExistComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReductionClaimExistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

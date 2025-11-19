import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { UncorrectedNonCompliancesExistComponent } from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-compliances/uncorrected-non-compliances-exist/uncorrected-non-compliances-exist.component';

describe('UncorrectedNonCompliancesExistComponent', () => {
  let component: UncorrectedNonCompliancesExistComponent;
  let fixture: ComponentFixture<UncorrectedNonCompliancesExistComponent>;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UncorrectedNonCompliancesExistComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UncorrectedNonCompliancesExistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

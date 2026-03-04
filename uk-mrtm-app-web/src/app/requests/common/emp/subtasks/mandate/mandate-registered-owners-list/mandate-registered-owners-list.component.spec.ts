import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { MockType } from '@netz/common/testing';

import { MandateRegisteredOwnersListComponent } from '@requests/common/emp/subtasks/mandate/mandate-registered-owners-list/mandate-registered-owners-list.component';
import { taskProviders } from '@requests/common/task.providers';

describe('MandateRegisteredOwnersListComponent', () => {
  let component: MandateRegisteredOwnersListComponent;
  let fixture: ComponentFixture<MandateRegisteredOwnersListComponent>;
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandateRegisteredOwnersListComponent],
      providers: [provideRouter([]), { provide: TaskService, useValue: taskServiceMock }, ...taskProviders],
    }).compileComponents();

    fixture = TestBed.createComponent(MandateRegisteredOwnersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

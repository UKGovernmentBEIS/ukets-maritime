import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskContentComponent } from '@requests/tasks/vir-wait-for-review/components/task-content';

describe('TaskContentComponent', () => {
  let component: TaskContentComponent;
  let fixture: ComponentFixture<TaskContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

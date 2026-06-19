import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TASK_STATUS_TAG_MAP, TaskStatusTagMap } from '@netz/common/pipes';

import { sections } from '../testing';
import { TaskSuperListComponent } from './task-superlist.component';

describe('TaskSuperListComponent', () => {
  let component: TaskSuperListComponent;
  let fixture: ComponentFixture<TaskSuperListComponent>;
  const map: TaskStatusTagMap = { COMPLETED: { text: 'COMPLETED', color: 'blue' } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: TASK_STATUS_TAG_MAP, useValue: map }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSuperListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('superSections', [
      { superTitle: 'Super Title 1', sections },
      { superTitle: 'Super Title 2', sections },
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the sections and tasks', () => {
    const element: HTMLElement = fixture.nativeElement;
    const taskItems = element.querySelectorAll<HTMLLIElement>('.app-task-list__item');

    expect(taskItems).toBeTruthy();
    expect(taskItems.length).toEqual(8);
  });
});

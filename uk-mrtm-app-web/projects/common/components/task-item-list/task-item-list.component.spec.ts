import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TASK_STATUS_TAG_MAP, TaskStatusTagMap } from '@netz/common/pipes';

import { tasks } from '../testing';
import { TaskItemListComponent } from './task-item-list.component';

describe('TaskItemListComponent', () => {
  let component: TaskItemListComponent;
  let fixture: ComponentFixture<TaskItemListComponent>;
  const map: TaskStatusTagMap = { COMPLETED: { text: 'COMPLETED', color: 'blue' } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: TASK_STATUS_TAG_MAP, useValue: map }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskItemListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('taskItems', tasks);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the tasks items', () => {
    const element: HTMLElement = fixture.nativeElement;
    const items = element.querySelectorAll<HTMLUListElement>('li');

    expect(items.length).toEqual(4);
  });
});

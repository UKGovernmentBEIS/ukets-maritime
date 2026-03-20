import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TASK_STATUS_TAG_MAP, TaskStatusTagMap } from '@netz/common/pipes';

import { tasks } from '../testing';
import { TaskSectionComponent } from './task-section.component';

describe('TaskSectionComponent', () => {
  let component: TaskSectionComponent;
  let fixture: ComponentFixture<TaskSectionComponent>;
  const map: TaskStatusTagMap = { COMPLETED: { text: 'COMPLETED', color: 'blue' } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: TASK_STATUS_TAG_MAP, useValue: map }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSectionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Test title');
    fixture.componentRef.setInput('tasks', tasks);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the title', () => {
    const element: HTMLElement = fixture.nativeElement;
    const header = element.querySelector<HTMLHeadingElement>('h2');

    expect(header.textContent).toEqual('Test title');
  });

  it('should render the tasks items', () => {
    const element: HTMLElement = fixture.nativeElement;
    const items = element.querySelectorAll<HTMLUListElement>('li');

    expect(items.length).toEqual(4);
  });
});

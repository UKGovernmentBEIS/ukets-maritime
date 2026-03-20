import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TaskSection } from '@netz/common/model';

import { TaskSectionComponent } from '../task-section';

@Component({
  selector: 'netz-task-list',
  imports: [TaskSectionComponent],
  standalone: true,
  templateUrl: './task-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  readonly sections = input<TaskSection[]>();
  readonly titleElement = input<'h2' | 'h3'>('h2');
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TaskSuperSection } from '@netz/common/model';

import { TaskListComponent } from '../task-list';

@Component({
  selector: 'netz-task-superlist',
  imports: [TaskListComponent],
  standalone: true,
  templateUrl: './task-superlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskSuperListComponent {
  readonly superSections = input<TaskSuperSection[]>();
}

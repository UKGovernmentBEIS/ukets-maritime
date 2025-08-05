import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TaskSuperSection } from '@netz/common/model';

import { TaskListComponent } from '../task-list';

@Component({
  selector: 'netz-task-superlist',
  templateUrl: './task-superlist.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskListComponent],
})
export class TaskSuperListComponent {
  @Input() superSections: TaskSuperSection[];
}

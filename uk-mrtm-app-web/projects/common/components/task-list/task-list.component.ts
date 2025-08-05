import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TaskSection } from '@netz/common/model';

import { TaskSectionComponent } from '../task-section';

@Component({
  selector: 'netz-task-list',
  templateUrl: './task-list.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskSectionComponent],
})
export class TaskListComponent {
  @Input() sections: TaskSection[];
  @Input() titleElement: 'h2' | 'h3' = 'h2';
}

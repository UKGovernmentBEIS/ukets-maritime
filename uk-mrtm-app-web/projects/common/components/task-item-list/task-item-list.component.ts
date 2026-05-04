import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TaskItem } from '@netz/common/model';

import { TaskItemComponent } from '../task-item';

/* eslint-disable @angular-eslint/component-selector */
@Component({
  selector: 'ul[netz-task-item-list]',
  imports: [TaskItemComponent],
  standalone: true,
  template: `
    @for (task of taskItems(); track $index) {
      <li
        netz-task-item
        [link]="task.link"
        [linkText]="task.linkText"
        [status]="task.status"
        [hint]="task.hint"
        [warningHint]="task.warningHint"
        [postContentComponent]="task.postContentComponent"
        [postContentComponentInputs]="{ taskItem: task }"></li>
    }
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.app-task-list__items]': 'taskListItems' },
})
export class TaskItemListComponent {
  readonly taskItems = input<TaskItem[]>();

  readonly taskListItems = true;
}

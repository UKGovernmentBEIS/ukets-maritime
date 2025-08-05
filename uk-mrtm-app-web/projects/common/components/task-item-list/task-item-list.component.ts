import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

import { TaskItem } from '@netz/common/model';

import { TaskItemComponent } from '../task-item';

/* eslint-disable @angular-eslint/component-selector */
@Component({
  selector: 'ul[netz-task-item-list]',
  template: `
    @for (task of taskItems; track i; let i = $index) {
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
    <ng-content></ng-content>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskItemComponent],
})
export class TaskItemListComponent {
  @Input() taskItems: TaskItem[];

  @HostBinding('class.app-task-list__items') readonly taskListItems = true;
}

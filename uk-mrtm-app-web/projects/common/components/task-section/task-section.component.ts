import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TaskItem } from '@netz/common/model';

import { TaskItemListComponent } from '../task-item-list';

/* eslint-disable @angular-eslint/component-selector */
@Component({
  selector: 'li[netz-task-section]',
  template: `
    @if (title) {
      @if (titleElement === 'h2') {
        <h2 class="app-task-list__section">{{ title }}</h2>
      } @else {
        <h3 class="app-task-list__section">{{ title }}</h3>
      }
    }
    @if (tasks) {
      <ul netz-task-item-list [taskItems]="tasks"></ul>
    }
    <ng-content></ng-content>
  `,
  standalone: true,
  imports: [TaskItemListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskSectionComponent {
  @Input() title: string;
  @Input() titleElement: 'h2' | 'h3' = 'h2';
  @Input() tasks: TaskItem[];
}

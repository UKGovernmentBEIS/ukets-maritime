import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TaskItem } from '@netz/common/model';

import { TaskItemListComponent } from '../task-item-list';

/* eslint-disable @angular-eslint/component-selector */
@Component({
  selector: 'li[netz-task-section]',
  imports: [TaskItemListComponent],
  standalone: true,
  template: `
    @if (title()) {
      @if (titleElement() === 'h2') {
        <h2 class="app-task-list__section">{{ title() }}</h2>
      } @else {
        <h3 class="app-task-list__section">{{ title() }}</h3>
      }
    }
    @if (tasks()) {
      <ul netz-task-item-list [taskItems]="tasks()"></ul>
    }
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskSectionComponent {
  readonly title = input<string>();
  readonly titleElement = input<'h2' | 'h3'>('h2');
  readonly tasks = input<TaskItem[]>();
}

import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, Type } from '@angular/core';
import { RouterLink } from '@angular/router';

import { StatusTagColorPipe, StatusTagTextPipe } from '@netz/common/pipes';
import { LinkDirective, TagComponent, WarningTextComponent } from '@netz/govuk-components';

/* eslint-disable @angular-eslint/component-selector */
@Component({
  selector: 'li[netz-task-item]',
  imports: [
    RouterLink,
    StatusTagColorPipe,
    StatusTagTextPipe,
    LinkDirective,
    TagComponent,
    WarningTextComponent,
    NgComponentOutlet,
  ],
  standalone: true,
  templateUrl: './task-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.app-task-list__item]': 'taskListItem' },
})
export class TaskItemComponent {
  readonly link = input<string>();
  readonly linkText = input<string>();
  readonly status = input<string>();
  readonly warningHint = input<string>();
  readonly hint = input<string>();
  readonly postContentComponent = input<Type<unknown>>();
  readonly postContentComponentInputs = input<Record<string, unknown>>();
  readonly taskListItem = true;
}

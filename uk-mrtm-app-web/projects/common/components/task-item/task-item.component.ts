import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input, Type } from '@angular/core';
import { RouterLink } from '@angular/router';

import { StatusTagColorPipe, StatusTagTextPipe } from '@netz/common/pipes';
import { LinkDirective, TagComponent, WarningTextComponent } from '@netz/govuk-components';

/* eslint-disable @angular-eslint/component-selector */
@Component({
  selector: 'li[netz-task-item]',
  standalone: true,
  imports: [
    RouterLink,
    StatusTagColorPipe,
    StatusTagTextPipe,
    LinkDirective,
    TagComponent,
    WarningTextComponent,
    NgComponentOutlet,
  ],
  templateUrl: './task-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  @Input() link: string;
  @Input() linkText: string;
  @Input() status: string;
  @Input() warningHint: string;
  @Input() hint: string;
  @Input() postContentComponent: Type<unknown>;
  @Input() postContentComponentInputs: Record<string, unknown>;
  @HostBinding('class.app-task-list__item') readonly taskListItem = true;
}

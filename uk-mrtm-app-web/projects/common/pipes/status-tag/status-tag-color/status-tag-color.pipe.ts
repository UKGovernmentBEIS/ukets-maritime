import { inject, Pipe, PipeTransform } from '@angular/core';

import { TagColor } from '@netz/govuk-components';

import { TASK_STATUS_TAG_MAP, TaskStatusTagMap } from '../status-tag.providers';

@Pipe({
  name: 'statusTagColor',
  standalone: true,
  pure: true,
})
export class StatusTagColorPipe implements PipeTransform {
  private statusMap = inject<TaskStatusTagMap>(TASK_STATUS_TAG_MAP, { optional: true })!;

  transform(status: string): TagColor {
    return this.statusMap?.[status]?.color;
  }
}

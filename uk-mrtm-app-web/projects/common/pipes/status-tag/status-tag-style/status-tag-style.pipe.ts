import { inject, Pipe, PipeTransform } from '@angular/core';

import { TASK_STATUS_TAG_MAP, TaskStatusTag, TaskStatusTagMap } from '../status-tag.providers';

@Pipe({
  name: 'statusTagStyle',
  standalone: true,
  pure: true,
})
export class StatusTagStylePipe implements PipeTransform {
  private statusMap = inject<TaskStatusTagMap>(TASK_STATUS_TAG_MAP, { optional: true })!;

  transform(status: string): TaskStatusTag['style'] {
    return this.statusMap?.[status]?.style;
  }
}

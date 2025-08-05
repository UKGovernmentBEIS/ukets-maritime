import { inject, Pipe, PipeTransform } from '@angular/core';

import { TASK_STATUS_TAG_MAP, TaskStatusTagMap } from '../status-tag.providers';

@Pipe({
  name: 'statusTagText',
  standalone: true,
  pure: true,
})
export class StatusTagTextPipe implements PipeTransform {
  private statusMap = inject<TaskStatusTagMap>(TASK_STATUS_TAG_MAP, { optional: true })!;

  transform(status: string): string {
    return this.statusMap?.[status]?.text;
  }
}

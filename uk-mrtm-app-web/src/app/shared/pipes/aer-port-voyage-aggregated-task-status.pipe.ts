import { Pipe, PipeTransform } from '@angular/core';

import { TaskItemStatus } from '@requests/common/task-item-status';

@Pipe({
  name: 'portVoyageAggregatedStatus',
  standalone: true,
})
export class AerPortVoyageAggregatedStatusPipe implements PipeTransform {
  transform(value: TaskItemStatus): string {
    switch (value) {
      case TaskItemStatus.COMPLETED:
        return 'Completed';
      case TaskItemStatus.NEEDS_REVIEW:
        return 'Needs review';
      case TaskItemStatus.IN_PROGRESS:
        return 'Incomplete';
    }
  }
}

import { Pipe, PipeTransform } from '@angular/core';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { ShipEmissionTableListItem } from '@shared/types';

@Pipe({
  name: 'portVoyageStatus',
  standalone: true,
})
export class PortVoyageTaskStatusPipe implements PipeTransform {
  transform(value: ShipEmissionTableListItem['status']): string {
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

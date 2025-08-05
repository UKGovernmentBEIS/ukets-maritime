import { Pipe, PipeTransform } from '@angular/core';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { ShipEmissionTableListItem } from '@shared/types';

@Pipe({
  name: 'shipTaskStatus',
  standalone: true,
})
export class ShipTaskStatusPipe implements PipeTransform {
  transform(value: ShipEmissionTableListItem['status']): string {
    switch (value) {
      case TaskItemStatus.COMPLETED:
        return 'Completed';
      case TaskItemStatus.IN_PROGRESS:
        return 'Incomplete';
    }
  }
}

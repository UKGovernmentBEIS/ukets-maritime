import { ShipDetails } from '@mrtm/api';

import { TaskItemStatus } from '@requests/common/task-item-status';

export interface ShipEmissionTableListItem extends ShipDetails {
  uniqueIdentifier: string;
  status: TaskItemStatus;
}

import { EmpShipEmissions, ShipDetails } from '@mrtm/api';

import { TaskItemStatus } from '@requests/common/task-item-status';

// TODO refactor to EmpEmissions and not ShipDetails
export interface ShipEmissionTableListItem extends ShipDetails {
  uniqueIdentifier: string;
  status: TaskItemStatus;
  source?: EmpShipEmissions & { status: TaskItemStatus };
}

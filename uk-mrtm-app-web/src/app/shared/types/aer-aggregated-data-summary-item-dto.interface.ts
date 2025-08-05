import { AerShipAggregatedData } from '@mrtm/api';

import { TaskItemStatus } from '@requests/common/task-item-status';

export interface AerAggregatedDataSummaryItemDto
  extends Pick<AerShipAggregatedData, 'imoNumber' | 'totalShipEmissions' | 'surrenderEmissions' | 'uniqueIdentifier'> {
  shipName: string;
  status: TaskItemStatus;
  canViewDetails: boolean;
}

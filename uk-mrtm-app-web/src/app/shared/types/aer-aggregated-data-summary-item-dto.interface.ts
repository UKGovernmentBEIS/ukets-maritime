import { AerShipAggregatedData } from '@mrtm/api';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { AerDataInitialSourceType } from '@shared/types/aer-data-initial-source-type.enum';

export interface AerAggregatedDataSummaryItemDto extends Pick<
  AerShipAggregatedData,
  'imoNumber' | 'totalShipEmissions' | 'surrenderEmissions' | 'uniqueIdentifier'
> {
  shipName: string;
  status: TaskItemStatus;
  canViewDetails: boolean;
  dataInputType?: AerDataInitialSourceType;
}

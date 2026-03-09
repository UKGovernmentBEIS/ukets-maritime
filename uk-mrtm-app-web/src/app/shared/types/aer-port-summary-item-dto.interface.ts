import { AerPort, AerPortDetails, AerPortEmissionsMeasurement, AerPortVisit } from '@mrtm/api';

import { TaskItemStatus } from '@requests/common/task-item-status';

export interface AerPortSummaryItemDto
  extends Pick<AerPort, 'imoNumber' | 'uniqueIdentifier'>,
    Omit<AerPortDetails, 'visit'>,
    AerPortVisit {
  surrenderEmissions: AerPortEmissionsMeasurement['total'];
  totalEmissions: AerPortEmissionsMeasurement['total'];
  status: TaskItemStatus;
  shipName?: string;
  canViewDetails: boolean;
}

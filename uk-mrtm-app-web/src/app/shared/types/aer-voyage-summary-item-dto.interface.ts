import { AerPortEmissionsMeasurement, AerPortVisit, AerVoyage, AerVoyageDetails } from '@mrtm/api';

import { TaskItemStatus } from '@requests/common/task-item-status';

export interface AerVoyageSummaryItemDto
  extends Pick<AerVoyage, 'imoNumber' | 'uniqueIdentifier'>,
    Omit<AerVoyageDetails, 'departurePort' | 'arrivalPort'> {
  departurePort: AerPortVisit['port'];
  departureCountry: AerPortVisit['country'];
  arrivalPort: AerPortVisit['port'];
  arrivalCountry: AerPortVisit['country'];
  surrenderEmissions: AerPortEmissionsMeasurement['total'];
  totalEmissions: AerPortEmissionsMeasurement['total'];
  status: TaskItemStatus;
  shipName?: string;
  canViewDetails: boolean;
}

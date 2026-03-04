import { AerPortEmissionsMeasurement, AerPortVisit, AerVoyage, AerVoyageDetails } from '@mrtm/api';

import { TaskItemStatus } from '@requests/common/task-item-status';
import { AerJourneyTypeEnum } from '@shared/types/aer-journey-type.enum';

export interface AerVoyageSummaryItemDto
  extends Pick<AerVoyage, 'imoNumber' | 'uniqueIdentifier'>, Omit<AerVoyageDetails, 'departurePort' | 'arrivalPort'> {
  departurePort: AerPortVisit['port'];
  departureCountry: AerPortVisit['country'];
  arrivalPort: AerPortVisit['port'];
  arrivalCountry: AerPortVisit['country'];
  surrenderEmissions: AerPortEmissionsMeasurement['total'];
  totalEmissions: AerPortEmissionsMeasurement['total'];
  journeyType?: AerJourneyTypeEnum;
  status: TaskItemStatus;
  shipName?: string;
  canViewDetails: boolean;
}

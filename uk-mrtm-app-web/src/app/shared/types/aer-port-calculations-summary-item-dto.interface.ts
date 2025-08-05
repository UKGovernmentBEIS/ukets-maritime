import { AerPortEmissionsMeasurement } from '@mrtm/api';

export interface AerVoyageOrPortCalculationsSummaryItemDto extends AerPortEmissionsMeasurement {
  emission: 'TOTAL' | 'SURRENDER';
}

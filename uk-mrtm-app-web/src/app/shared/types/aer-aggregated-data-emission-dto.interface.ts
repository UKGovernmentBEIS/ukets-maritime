import { AerPortEmissionsMeasurement } from '@mrtm/api';

export interface AerAggregatedDataEmissionDto extends Partial<AerPortEmissionsMeasurement> {
  isSummary?: boolean;
  emission: string;
}

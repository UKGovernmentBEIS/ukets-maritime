import { AerAggregatedDataFuelConsumption, AerShipAggregatedData } from '@mrtm/api';

import { WithNeedsReview } from '@shared/types/with-needs-review.dto';

export interface AerAggregatedDataShipSummary extends Omit<AerShipAggregatedData, 'fuelConsumptions'> {
  fuelConsumptions?: Array<WithNeedsReview<AerAggregatedDataFuelConsumption>>;
}

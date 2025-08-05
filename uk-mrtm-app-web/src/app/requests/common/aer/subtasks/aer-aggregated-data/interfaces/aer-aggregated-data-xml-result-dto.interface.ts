import { AerShipAggregatedDataSave } from '@mrtm/api';

import { XmlValidationError } from '@shared/types';

export interface AerAggregatedDataXmlResultDto {
  data: AerShipAggregatedDataSave[];
  errors: XmlValidationError[];
}

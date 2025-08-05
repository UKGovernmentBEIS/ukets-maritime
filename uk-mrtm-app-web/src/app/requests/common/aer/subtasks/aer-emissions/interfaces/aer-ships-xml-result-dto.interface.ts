import { AerShipEmissions } from '@mrtm/api';

import { XmlValidationError } from '@shared/types';

export interface AerShipsXMLResultDto {
  data: AerShipEmissions[];
  errors: XmlValidationError[];
}

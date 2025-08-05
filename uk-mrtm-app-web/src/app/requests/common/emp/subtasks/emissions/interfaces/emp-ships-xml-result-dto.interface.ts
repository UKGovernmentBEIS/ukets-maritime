import { EmpShipEmissions } from '@mrtm/api';

import { XmlValidationError } from '@shared/types/xml-validation-error.interface';

export interface EmpShipsXMLResultDto {
  data: EmpShipEmissions[];
  errors: XmlValidationError[];
}

import { AerShipEmissions, EmpShipEmissions } from '@mrtm/api';

import { XmlValidationError } from '@shared/types';

export interface ShipsXmlService {
  parse(
    xmlText: string,
    reportingYear?: string,
  ): {
    data: EmpShipEmissions[] | AerShipEmissions[];
    errors: XmlValidationError[];
  };
}

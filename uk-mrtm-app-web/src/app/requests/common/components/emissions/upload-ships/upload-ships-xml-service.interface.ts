import { AerShipEmissions, EmpShipEmissions } from '@mrtm/api';

import { XmlResult } from '@shared/types';

export interface ShipsXmlService {
  parse(xmlText: string, reportingYear?: string): XmlResult<EmpShipEmissions[] | AerShipEmissions[]>;
}

import { FormControl } from '@angular/forms';

import { EmpShipEmissions, ExemptionConditions } from '@mrtm/api';

export type ExemptionConditionsFormType = ExemptionConditions & { shipId: EmpShipEmissions['uniqueIdentifier'] };

export type ExemptionConditionsFormModel = Record<keyof ExemptionConditionsFormType, FormControl>;

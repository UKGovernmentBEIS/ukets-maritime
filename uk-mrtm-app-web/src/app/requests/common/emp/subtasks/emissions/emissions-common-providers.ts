import { Provider } from '@angular/core';

import { PAYLOAD_MUTATORS } from '@netz/common/forms';

import {
  BasicShipDetailPayloadMutator,
  CarbonCapturePayloadMutator,
  DeleteShipsPayloadMutator,
  EmissionSourcesAndFuelTypesUsedListPayloadMutator,
  EmissionSourcesAndFuelTypesUsedPayloadMutator,
  EmpUploadShipsPayloadMutator,
  ExemptionConditionsPayloadMutator,
  FuelsAndEmissionFactorsFormPayloadMutator,
  FuelsAndEmissionFactorsListPayloadMutator,
  MeasurementsPayloadMutator,
  ShipSummaryPayloadMutator,
  UncertaintyLevelPayloadMutator,
} from '@requests/common/emp/subtasks/emissions';

export const provideEmpEmissionsSubtaskCommonPayloadMutators: () => Provider[] = () => [
  { provide: PAYLOAD_MUTATORS, multi: true, useClass: BasicShipDetailPayloadMutator },
  { provide: PAYLOAD_MUTATORS, multi: true, useClass: FuelsAndEmissionFactorsFormPayloadMutator },
  { provide: PAYLOAD_MUTATORS, multi: true, useClass: FuelsAndEmissionFactorsListPayloadMutator },
  { provide: PAYLOAD_MUTATORS, multi: true, useClass: EmissionSourcesAndFuelTypesUsedPayloadMutator },
  { provide: PAYLOAD_MUTATORS, multi: true, useClass: EmissionSourcesAndFuelTypesUsedListPayloadMutator },
  { provide: PAYLOAD_MUTATORS, multi: true, useClass: UncertaintyLevelPayloadMutator },
  { provide: PAYLOAD_MUTATORS, multi: true, useClass: MeasurementsPayloadMutator },
  { provide: PAYLOAD_MUTATORS, multi: true, useClass: CarbonCapturePayloadMutator },
  { provide: PAYLOAD_MUTATORS, multi: true, useClass: ExemptionConditionsPayloadMutator },
  { provide: PAYLOAD_MUTATORS, multi: true, useClass: DeleteShipsPayloadMutator },
  { provide: PAYLOAD_MUTATORS, multi: true, useClass: ShipSummaryPayloadMutator },
  { provide: PAYLOAD_MUTATORS, multi: true, useClass: EmpUploadShipsPayloadMutator },
];

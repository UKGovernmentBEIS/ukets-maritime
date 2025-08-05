import { isNil } from 'lodash-es';

import { AerFuelConsumption, AerPort, AerPortEmissionsMeasurement } from '@mrtm/api';

import {
  AER_DELETE_DIRECT_EMISSIONS_STEP,
  AER_DELETE_FUEL_CONSUMPTION_STEP,
  AER_DIRECT_EMISSIONS_STEP,
  AER_EMISSIONS_CALCULATIONS_STEP,
  AER_FUEL_CONSUMPTION_STEP,
  AER_SELECT_SHIP_STEP,
} from '@requests/common/aer/aer.consts';
import { TaskItemStatus } from '@requests/common/task-item-status';

export const AER_PORTS_SUB_TASK = 'ports';

export enum AerPortsWizardStep {
  SUMMARY = '../',
  LIST_OF_PORTS = 'list-of-ports',
  PORT_CALL_SUMMARY = 'port-call-summary',
  PORT_CALL = 'port-call',
  SELECT_SHIP = AER_SELECT_SHIP_STEP,
  PORT_DETAILS = 'details',
  IN_PORT_EMISSIONS = AER_EMISSIONS_CALCULATIONS_STEP,
  DIRECT_EMISSIONS = AER_DIRECT_EMISSIONS_STEP,
  FUEL_CONSUMPTION = AER_FUEL_CONSUMPTION_STEP,
  UPLOAD_PORTS = 'upload-ports',
  DELETE_PORT = 'delete',
  DELETE_FUEL_CONSUMPTION = AER_DELETE_FUEL_CONSUMPTION_STEP,
  DELETE_DIRECT_EMISSIONS = AER_DELETE_DIRECT_EMISSIONS_STEP,
}

export const AER_PORT_PARAM = 'portId';

export const portEmissionsMeasurementCompleted = (emission: AerPortEmissionsMeasurement): boolean =>
  !isNil(emission?.co2) && !isNil(emission?.ch4) && !isNil(emission?.n2o) && !isNil(emission?.total);

export const portFuelConsumptionCompleted = (fuelConsumption: AerFuelConsumption): boolean =>
  !isNil(fuelConsumption?.totalConsumption) &&
  !isNil(fuelConsumption?.name) &&
  !isNil(fuelConsumption?.fuelOriginTypeName) &&
  !isNil(fuelConsumption?.measuringUnit) &&
  !isNil(fuelConsumption?.amount);

export const portSelectShipCompleted = (port: AerPort) => !isNil(port?.imoNumber);

export const portDetailsCompleted = (port: AerPort): boolean =>
  !isNil(port?.portDetails?.visit?.country) &&
  !isNil(port?.portDetails?.visit?.port) &&
  !isNil(port?.portDetails?.arrivalTime) &&
  !isNil(port?.portDetails?.departureTime);

export const portEmissionsCompleted = (port: AerPort, isUploadCSV = false): boolean => {
  const shouldValidateEmissions = isUploadCSV
    ? true
    : portEmissionsMeasurementCompleted(port?.totalEmissions) &&
      portEmissionsMeasurementCompleted(port?.surrenderEmissions);

  const hasAtLeastOneEmissionCategory = !isNil(port.directEmissions) || port?.fuelConsumptions?.length > 0;

  return (
    (isNil(port.directEmissions) ||
      portEmissionsMeasurementCompleted(port.directEmissions) ||
      (port?.fuelConsumptions?.length && port?.fuelConsumptions?.every(portFuelConsumptionCompleted))) &&
    shouldValidateEmissions &&
    hasAtLeastOneEmissionCategory
  );
};

export const aerPortStepsCompletedMap: Record<
  keyof (Pick<AerPort, 'imoNumber' | 'portDetails'> & { portEmissions: unknown }),
  (port: AerPort, isUploadCSV?: boolean) => boolean
> = {
  imoNumber: portSelectShipCompleted,
  portDetails: portDetailsCompleted,
  portEmissions: portEmissionsCompleted,
};

export const isPortWizardCompleted = (port: AerPort, isUploadCSV = false) => {
  for (const key of Object.keys(aerPortStepsCompletedMap)) {
    if (!aerPortStepsCompletedMap[key](port, isUploadCSV)) {
      return false;
    }
  }

  return true;
};

export const isWizardCompleted = (ports: Array<AerPort & { status: TaskItemStatus }>, isUploadCSV = false): boolean =>
  ports?.length &&
  ports.every((port) => port.status === TaskItemStatus.COMPLETED && isPortWizardCompleted(port, isUploadCSV));

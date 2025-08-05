import { AerPort, AerPortVisit, AerVoyage } from '@mrtm/api';

import { FlattenedPort, FlattenedVoyage } from '@requests/common/aer/aer.types';
import { formatDateTimeFromString } from '@shared/utils';

export const generatePortUuid = (
  imoNumber: AerPort['imoNumber'],
  visitCountry: AerPortVisit['country'],
  visitPort: AerPortVisit['port'],
  arrivalTime: string,
  departureTime: string,
): string => imoNumber + visitCountry + visitPort + arrivalTime + departureTime;

export const generatePortUuidFromFlattened = (fp: FlattenedPort): string => {
  const arrivalTime = formatIsoDateTimeNoMs(fp.arrivalDate, fp.arrivalActualTime);
  const departureTime = formatIsoDateTimeNoMs(fp.departureDate, fp.departureActualTime);

  return generatePortUuid(fp.imoNumber, fp.visitCountry, fp.visitPort, arrivalTime, departureTime);
};

export const generateVoyageUuid = (
  imoNumber: AerVoyage['imoNumber'],
  departureCountry: AerPortVisit['country'],
  departurePort: AerPortVisit['port'],
  departureTime: string,
  arrivalCountry: AerPortVisit['country'],
  arrivalPort: AerPortVisit['port'],
  arrivalTime: string,
): string => imoNumber + departureCountry + departurePort + departureTime + arrivalCountry + arrivalPort + arrivalTime;

export const generateVoyageUuidFromFlattened = (fv: FlattenedVoyage): string => {
  const departureTime = formatIsoDateTimeNoMs(fv.departureDate, fv.departureActualTime);
  const arrivalTime = formatIsoDateTimeNoMs(fv.arrivalDate, fv.arrivalActualTime);

  return generateVoyageUuid(
    fv.imoNumber,
    fv.departureCountry,
    fv.departurePort,
    departureTime,
    fv.arrivalCountry,
    fv.arrivalPort,
    arrivalTime,
  );
};

export const hasFuelConsumption = (fv: FlattenedVoyage | FlattenedPort): boolean =>
  fv.fuelConsumptionOrigin !== null && fv.fuelConsumptionType !== null && fv.fuelConsumptionAmount !== null;

export const hasDirectEmission = (fv: FlattenedVoyage | FlattenedPort): boolean =>
  fv.directEmissionsCO2 !== null && fv.directEmissionsCH4 !== null && fv.directEmissionsN2O !== null;

export const formatIsoDateTimeNoMs = (date: string, time: string): string =>
  formatDateTimeFromString(date, time, true)?.toISOString().slice(0, -5) + 'Z';

export const getVoyagePortUuidProperties = (
  entry: FlattenedVoyage | FlattenedPort,
  type: 'voyages' | 'ports',
): FlattenedVoyage | FlattenedPort => {
  return type === 'voyages'
    ? ({
        imoNumber: entry?.['imoNumber'],
        departureCountry: entry?.['departureCountry'],
        departurePort: entry?.['departurePort'],
        departureDate: entry?.['departureDate'],
        departureActualTime: entry?.['departureActualTime'],
        arrivalCountry: entry?.['arrivalCountry'],
        arrivalPort: entry?.['arrivalPort'],
        arrivalDate: entry?.['arrivalDate'],
        arrivalActualTime: entry?.['arrivalActualTime'],
      } as FlattenedVoyage)
    : ({
        imoNumber: entry?.['imoNumber'],
        visitCountry: entry?.['visitCountry'],
        visitPort: entry?.['visitPort'],
        arrivalDate: entry?.['arrivalDate'],
        arrivalActualTime: entry?.['arrivalActualTime'],
        departureDate: entry?.['departureDate'],
        departureActualTime: entry?.['departureActualTime'],
      } as FlattenedPort);
};

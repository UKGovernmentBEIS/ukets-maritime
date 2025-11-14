import {
  FuelTypeCodeDTO as AerFuelTypeCodeDTO,
  FuelTypeEmissionFactorEditDTO as AerFuelTypeEmissionFactorEditDTO,
} from '@requests/common/aer/subtasks/aer-emissions/interfaces';
import { FuelTypeCodeDTO, FuelTypeEmissionFactorEditDTO } from '@requests/common/emp/subtasks/emissions';
import { FuelTypeCodeEnum } from '@requests/common/types';

/**
 * Parameter fuel.otherFuelType may be retrieved as an array if multiple tags exist.
 * Since we need a key always, we get the first element and catch it later
 */
export const getFuelKey = (
  fuel: FuelTypeCodeDTO | AerFuelTypeCodeDTO | FuelTypeEmissionFactorEditDTO | AerFuelTypeEmissionFactorEditDTO,
): string => {
  const otherFuelType = Array.isArray(fuel?.otherFuelType)
    ? fuel?.otherFuelType[0]?.toUpperCase()
    : fuel?.otherFuelType?.toUpperCase();

  return otherFuelType ? `${fuel?.fuelTypeCode}-${otherFuelType}` : fuel?.fuelTypeCode;
};

/**
 * Creates a unique ID that serves as a key to check for duplication of fuels
 * Parameter fuelTypeEmissionFactorEditDTO.otherFuelType may be retrieved as an array if multiple tags exist.
 * Since we need a key always, we get the first element and catch it later
 */
export const getUniqueFuelEmissionFactorId = (
  fuelTypeEmissionFactorEditDTO: FuelTypeEmissionFactorEditDTO | AerFuelTypeEmissionFactorEditDTO,
): string => {
  if (fuelTypeEmissionFactorEditDTO.fuelTypeCode === FuelTypeCodeEnum.OTHER) {
    const otherFuelType = Array.isArray(fuelTypeEmissionFactorEditDTO?.otherFuelType)
      ? fuelTypeEmissionFactorEditDTO?.otherFuelType[0]?.toUpperCase()
      : fuelTypeEmissionFactorEditDTO?.otherFuelType?.toUpperCase();

    return `${fuelTypeEmissionFactorEditDTO.fuelOriginCode}-${fuelTypeEmissionFactorEditDTO.fuelTypeCode}-${otherFuelType}`;
  }

  return `${fuelTypeEmissionFactorEditDTO.fuelOriginCode}-${fuelTypeEmissionFactorEditDTO.fuelTypeCode}`;
};

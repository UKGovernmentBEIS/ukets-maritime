import { EmpBioFuels, EmpEFuels, EmpFossilFuels, EmpFuelsAndEmissionsFactors } from '@mrtm/api';

import { fuelsAndEmissionsFormFlowMap } from '@requests/common/components/emissions/fuels-and-emissions-factors-form/fuels-and-emissions-factors-form.helper';
import { EmissionFactorDtoValidator } from '@requests/common/emp/subtasks/emissions';
import { FuelTypeEmissionFactorEditDTO, ShipParticularsDTO } from '@requests/common/emp/subtasks/emissions/interfaces';
import {
  FuelOriginCodeEnum,
  FuelTypeCodeEnum,
  MethodDensityBunkerCodeEnum,
  MethodDensityTankCodeEnum,
} from '@requests/common/types';
import { getUniqueFuelEmissionFactorId } from '@requests/common/utils/emissions';
import { XmlResult } from '@shared/types';
import { isNil } from '@shared/utils';
import { XmlValidator } from '@shared/validators';

export class FuelTypeEmissionFactorEditDtoValidator {
  private static isFuelOriginValid(value?: FuelTypeEmissionFactorEditDTO): boolean {
    return XmlValidator.isEnum(value?.fuelOriginCode, FuelOriginCodeEnum);
  }

  private static isFuelTypeValid(value?: FuelTypeEmissionFactorEditDTO): boolean {
    return (
      XmlValidator.isEnum(value?.fuelTypeCode, FuelTypeCodeEnum) &&
      !isNil(fuelsAndEmissionsFormFlowMap?.[value?.fuelOriginCode]?.[value?.fuelTypeCode])
    );
  }

  private static isFuelOtherValid(value?: FuelTypeEmissionFactorEditDTO): boolean {
    return (
      (value?.fuelTypeCode === FuelTypeCodeEnum.OTHER &&
        XmlValidator.isRequired(value?.otherFuelType) &&
        XmlValidator.maxLength(value?.otherFuelType, 30) &&
        XmlValidator.isString(value?.otherFuelType)) ||
      value?.fuelTypeCode !== FuelTypeCodeEnum.OTHER
    );
  }

  private static isMethodDensityBunkerCodeValid(value?: MethodDensityBunkerCodeEnum): boolean {
    return XmlValidator.isEnum(value, MethodDensityBunkerCodeEnum);
  }

  private static isMethodDensityTankCodeValid(value?: MethodDensityTankCodeEnum): boolean {
    return XmlValidator.isEnum(value, MethodDensityTankCodeEnum);
  }

  /**
   * Validates that all FuelTypeEmissionFactorEditDTO[] are valid and no duplicates exist
   */
  private static areFuelTypeEmissionFactorEditDTOsValid(
    fuelTypeEmissionFactorEditDTOs?: FuelTypeEmissionFactorEditDTO[],
  ): boolean {
    const existingFactors: string[] = [];

    const fuelsLengthValid = fuelTypeEmissionFactorEditDTOs?.length > 0;
    const allFuelsValid = fuelTypeEmissionFactorEditDTOs?.every((fuelTypeEmissionFactorEditDTO) => {
      const existingFactorId = getUniqueFuelEmissionFactorId(fuelTypeEmissionFactorEditDTO);
      const duplicateFuelExists = existingFactors.includes(existingFactorId);
      existingFactors.push(existingFactorId);

      return (
        !duplicateFuelExists &&
        this.isFuelOriginValid(fuelTypeEmissionFactorEditDTO) &&
        this.isFuelTypeValid(fuelTypeEmissionFactorEditDTO) &&
        this.isFuelOtherValid(fuelTypeEmissionFactorEditDTO) &&
        this.isMethodDensityBunkerCodeValid(fuelTypeEmissionFactorEditDTO?.methodDensityBunkerCode) &&
        this.isMethodDensityTankCodeValid(fuelTypeEmissionFactorEditDTO?.methodDensityTankCode) &&
        EmissionFactorDtoValidator.areEmissionFactorDTOsValid(fuelTypeEmissionFactorEditDTO)
      );
    });

    return fuelsLengthValid && allFuelsValid;
  }

  /**
   * Transforms FuelTypeEmissionFactorEditDTO[] to Array<EmpFossilFuels | EmpBioFuels | EmpEFuels>
   * Assumes that all FuelTypeEmissionFactorEditDTO[] are valid at this point
   */
  private static transformFuelTypeEmissionFactorEditDTOs(
    fuelDTOs: FuelTypeEmissionFactorEditDTO[],
  ): Array<EmpFossilFuels | EmpBioFuels | EmpEFuels> {
    return fuelDTOs.map((fuelTypeEmissionFactorEditDTO) => ({
      uniqueIdentifier: crypto.randomUUID(),
      origin: fuelTypeEmissionFactorEditDTO.fuelOriginCode,
      type: fuelTypeEmissionFactorEditDTO.fuelTypeCode,
      name: fuelTypeEmissionFactorEditDTO?.otherFuelType ? fuelTypeEmissionFactorEditDTO.otherFuelType : null,
      densityMethodBunker: fuelTypeEmissionFactorEditDTO.methodDensityBunkerCode,
      densityMethodTank: fuelTypeEmissionFactorEditDTO.methodDensityTankCode,
      ...EmissionFactorDtoValidator.transformEmissionFactorsToEmissionFactorsCompounds(fuelTypeEmissionFactorEditDTO),
    }));
  }

  /**
   * Validates FuelTypeEmissionFactorEditDTO[] and returns XmlResult<EmpFuelsAndEmissionsFactors[]>
   * This should be explicitly called and displayed after validateCoreShipParticularsDTO is valid
   */
  public static validateFuelTypeEmissionFactorEditDTOs(
    shipParticular: ShipParticularsDTO,
  ): XmlResult<EmpFuelsAndEmissionsFactors[]> {
    const fuelDTOs = shipParticular?.monitoringPlan?.fuelTypes?.fuelTypeEntry;
    if (this.areFuelTypeEmissionFactorEditDTOsValid(fuelDTOs)) {
      return {
        data: this.transformFuelTypeEmissionFactorEditDTOs(fuelDTOs),
      };
    }

    return {
      errors: [
        {
          row: shipParticular.name,
          column: 'NO_FIELD',
          message:
            'There are errors in the fuels and emissions factors you uploaded. Check the information entered and reupload the file',
        },
      ],
    };
  }
}

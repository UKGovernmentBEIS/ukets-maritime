import { isNil } from 'lodash-es';

import { AerFuelsAndEmissionsFactors } from '@mrtm/api';

import {
  EmissionReportDetailsDTO,
  FuelTypeEmissionFactorEditDTO,
} from '@requests/common/aer/subtasks/aer-emissions/interfaces';
import { AerEmissionFactorDtoValidator } from '@requests/common/aer/subtasks/aer-emissions/validators/aer-emission-factor-dto.validator';
import { fuelsAndEmissionsFormFlowMap } from '@requests/common/components/emissions/fuels-and-emissions-factors-form/fuels-and-emissions-factors-form.helper';
import { FuelOriginCodeEnum, FuelTypeCodeEnum } from '@requests/common/types';
import { AerFuel, XmlResult } from '@shared/types';
import { XmlValidator } from '@shared/validators';

export class AerFuelTypeEmissionFactorEditDtoValidator {
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
        XmlValidator.maxLength(value?.otherFuelType, 30)) ||
      value?.fuelTypeCode !== FuelTypeCodeEnum.OTHER
    );
  }

  /**
   * Creates a unique ID that serves as a key to check for duplication of fuels
   */
  private static getUniqueFuelEmissionFactorId(fuelTypeEmissionFactorEditDTO: FuelTypeEmissionFactorEditDTO): string {
    if (fuelTypeEmissionFactorEditDTO.fuelTypeCode === FuelTypeCodeEnum.OTHER) {
      return `${fuelTypeEmissionFactorEditDTO.fuelOriginCode}-${fuelTypeEmissionFactorEditDTO.fuelTypeCode}-${fuelTypeEmissionFactorEditDTO.otherFuelType?.toUpperCase()}`;
    }

    return `${fuelTypeEmissionFactorEditDTO.fuelOriginCode}-${fuelTypeEmissionFactorEditDTO.fuelTypeCode}`;
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
      const existingFactorId = this.getUniqueFuelEmissionFactorId(fuelTypeEmissionFactorEditDTO);
      const duplicateFuelExists = existingFactors.includes(existingFactorId);
      existingFactors.push(existingFactorId);

      return (
        !duplicateFuelExists &&
        this.isFuelOriginValid(fuelTypeEmissionFactorEditDTO) &&
        this.isFuelTypeValid(fuelTypeEmissionFactorEditDTO) &&
        this.isFuelOtherValid(fuelTypeEmissionFactorEditDTO) &&
        AerEmissionFactorDtoValidator.areEmissionFactorDTOsValid(fuelTypeEmissionFactorEditDTO)
      );
    });

    return fuelsLengthValid && allFuelsValid;
  }

  /**
   * Transforms FuelTypeEmissionFactorEditDTO[] to Array<AerFuel>
   * Assumes that all FuelTypeEmissionFactorEditDTO[] are valid at this point
   */
  private static transformFuelTypeEmissionFactorEditDTOs(fuelDTOs: FuelTypeEmissionFactorEditDTO[]): Array<AerFuel> {
    return fuelDTOs.map((fuelTypeEmissionFactorEditDTO) => ({
      uniqueIdentifier: crypto.randomUUID(),
      origin: fuelTypeEmissionFactorEditDTO.fuelOriginCode,
      type: fuelTypeEmissionFactorEditDTO.fuelTypeCode,
      name: fuelTypeEmissionFactorEditDTO?.otherFuelType ? fuelTypeEmissionFactorEditDTO.otherFuelType : null,
      ...AerEmissionFactorDtoValidator.transformEmissionFactorsToEmissionFactorsCompounds(
        fuelTypeEmissionFactorEditDTO,
      ),
    }));
  }

  /**
   * Validates FuelTypeEmissionFactorEditDTO[] and returns XmlResult<AerFuelsAndEmissionsFactors[]>
   * This should be explicitly called and displayed after validateCoreEmissionReportDetailsDTOs is valid
   */
  public static validateFuelTypeEmissionFactorEditDTOs(
    emissionReportDetails?: EmissionReportDetailsDTO,
  ): XmlResult<AerFuelsAndEmissionsFactors[]> {
    const fuelDTOs = emissionReportDetails?.fuelTypes?.fuelTypeEntry;
    if (this.areFuelTypeEmissionFactorEditDTOsValid(fuelDTOs)) {
      return {
        data: this.transformFuelTypeEmissionFactorEditDTOs(fuelDTOs),
      };
    }

    return {
      errors: [
        {
          row: emissionReportDetails.name,
          column: 'NO_FIELD',
          message:
            'There are errors in the fuels and emissions factors you uploaded. Check the information entered and reupload the file',
        },
      ],
    };
  }
}

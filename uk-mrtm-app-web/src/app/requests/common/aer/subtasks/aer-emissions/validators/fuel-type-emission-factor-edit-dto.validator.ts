import { AerFuelsAndEmissionsFactors } from '@mrtm/api';

import {
  EmissionFactorDTO,
  FuelTypeEmissionFactorEditDTO,
} from '@requests/common/aer/subtasks/aer-emissions/interfaces';
import { fuelsAndEmissionsFormFlowMap } from '@requests/common/components/emissions/fuels-and-emissions-factors-form/fuels-and-emissions-factors-form.helper';
import { FactorReferenceCodeEnum, FuelOriginCodeEnum, FuelTypeCodeEnum, GhgCodeEnum } from '@requests/common/types';
import { AerFuel } from '@shared/types';
import { XmlValidator } from '@shared/validators';

export class AerFuelTypeEmissionFactorEditDtoValidator {
  private static isFuelOriginCodeValid(value?: FuelOriginCodeEnum) {
    return XmlValidator.isEnum(value, FuelOriginCodeEnum);
  }

  private static isEmissionFactorValid(value?: EmissionFactorDTO) {
    return (
      XmlValidator.isEnum(value?.factorReferenceCode, FactorReferenceCodeEnum) &&
      XmlValidator.isEnum(value?.ghgCode, GhgCodeEnum)
    );
  }

  private static isFuelTypeCodeValid(value?: FuelTypeCodeEnum, fuelOriginCode?: FuelOriginCodeEnum) {
    return XmlValidator.isEnum(value, FuelTypeCodeEnum) && fuelsAndEmissionsFormFlowMap?.[fuelOriginCode]?.[value];
  }

  private static isValidFactorCompound(value?: string) {
    return XmlValidator.maxDecimalValidator(value, true, 12);
  }

  /**
   * Validates and transforms EmissionFactorDTO[] to Pick<FuelsAndEmissionsFactors, 'methane' | 'carbonDioxide' | 'nitrousOxide'>
   * If provided EmissionFactor.factorReferenceCode === 'DEFAULT'
   * or EmissionFactor.factorReferenceCode is disabledField in fuelsAndEmissionsFormFlowMap
   * set each chemical element to its default values, bypassing EmissionFactor.ttwEF
   */
  private static transformEmissionFactorsToEmissionFactorsCompounds(
    fuelTypeEmissionFactorEditDTO?: FuelTypeEmissionFactorEditDTO,
  ): Partial<Pick<AerFuelsAndEmissionsFactors, 'methane' | 'carbonDioxide' | 'nitrousOxide'>> {
    const emissionFactorCompounds: Partial<
      Pick<AerFuelsAndEmissionsFactors, 'methane' | 'carbonDioxide' | 'nitrousOxide'>
    > = {};
    const isFuelOriginCodeValid = this.isFuelOriginCodeValid(fuelTypeEmissionFactorEditDTO?.fuelOriginCode);
    const isFuelTypeCodeValid = this.isFuelTypeCodeValid(
      fuelTypeEmissionFactorEditDTO?.fuelTypeCode,
      fuelTypeEmissionFactorEditDTO?.fuelOriginCode,
    );

    if (isFuelOriginCodeValid && isFuelTypeCodeValid && fuelTypeEmissionFactorEditDTO?.emissionFactors?.length) {
      for (const emissionFactor of fuelTypeEmissionFactorEditDTO.emissionFactors) {
        if (AerFuelTypeEmissionFactorEditDtoValidator.isEmissionFactorValid(emissionFactor)) {
          const originCode = fuelTypeEmissionFactorEditDTO?.fuelOriginCode;
          const fuelTypeCode = fuelTypeEmissionFactorEditDTO?.fuelTypeCode;
          let currentCompound: 'methane' | 'carbonDioxide' | 'nitrousOxide';

          switch (emissionFactor?.ghgCode) {
            case GhgCodeEnum.CH4:
              currentCompound = 'methane';
              break;
            case GhgCodeEnum.CO2:
              currentCompound = 'carbonDioxide';
              break;
            case GhgCodeEnum.N2O:
              currentCompound = 'nitrousOxide';
              break;
          }

          const isCompoundDisabled =
            fuelsAndEmissionsFormFlowMap?.[originCode]?.[fuelTypeCode]?.disabledFields?.includes(currentCompound);

          if (isCompoundDisabled || emissionFactor?.factorReferenceCode === FactorReferenceCodeEnum.DEFAULT) {
            emissionFactorCompounds[currentCompound] =
              fuelsAndEmissionsFormFlowMap?.[originCode]?.[fuelTypeCode]?.data?.[currentCompound] ?? null;
          } else if (this.isValidFactorCompound(emissionFactor?.ttwEF)) {
            emissionFactorCompounds[currentCompound] = String(emissionFactor?.ttwEF);
          }
        }
      }
    }

    return emissionFactorCompounds;
  }

  /**
   * Creates a unique ID that serves as key to check for duplication of fuels
   */
  private static getUniqueEmissionFactorId(fuelTypeEmissionFactorEditDTO: FuelTypeEmissionFactorEditDTO): string {
    if (fuelTypeEmissionFactorEditDTO.fuelTypeCode === FuelTypeCodeEnum.OTHER) {
      return `${fuelTypeEmissionFactorEditDTO.fuelOriginCode}-${fuelTypeEmissionFactorEditDTO.fuelTypeCode}-${fuelTypeEmissionFactorEditDTO.otherFuelType}`;
    }

    return `${fuelTypeEmissionFactorEditDTO.fuelOriginCode}-${fuelTypeEmissionFactorEditDTO.fuelTypeCode}`;
  }

  /**
   * Validate and transform FuelTypeEmissionFactorEditDTO[] to FuelsAndEmissionsFactors[]
   * If there is a duplication based on getUniqueEmissionFactorId, item will not be stored
   */
  public static transformFuelTypeEmissionFactorEditDTO(
    fuelTypeEmissionFactorEditDTOs: FuelTypeEmissionFactorEditDTO[],
  ): Partial<AerFuel>[] {
    const fuelsAndEmissionsFactors: Partial<AerFuel>[] = [];
    const existingFactors: string[] = [];

    if (fuelTypeEmissionFactorEditDTOs?.length) {
      for (const fuelTypeEmissionFactorEditDTO of fuelTypeEmissionFactorEditDTOs) {
        const existingFactorId = this.getUniqueEmissionFactorId(fuelTypeEmissionFactorEditDTO);

        if (existingFactors.includes(existingFactorId)) {
          break;
        }

        let fuelsAndEmissionsFactor: Partial<AerFuel> = {
          uniqueIdentifier: crypto.randomUUID(),
        };

        if (
          AerFuelTypeEmissionFactorEditDtoValidator.isFuelOriginCodeValid(fuelTypeEmissionFactorEditDTO?.fuelOriginCode)
        ) {
          fuelsAndEmissionsFactor.origin = fuelTypeEmissionFactorEditDTO.fuelOriginCode;
        }

        if (
          AerFuelTypeEmissionFactorEditDtoValidator.isFuelTypeCodeValid(
            fuelTypeEmissionFactorEditDTO?.fuelTypeCode,
            fuelTypeEmissionFactorEditDTO?.fuelOriginCode,
          )
        ) {
          fuelsAndEmissionsFactor.type = fuelTypeEmissionFactorEditDTO.fuelTypeCode;
        }

        if (fuelTypeEmissionFactorEditDTO?.fuelTypeCode === FuelTypeCodeEnum.OTHER) {
          fuelsAndEmissionsFactor.name = fuelTypeEmissionFactorEditDTO.otherFuelType;
        }

        fuelsAndEmissionsFactor = {
          ...fuelsAndEmissionsFactor,
          ...AerFuelTypeEmissionFactorEditDtoValidator.transformEmissionFactorsToEmissionFactorsCompounds(
            fuelTypeEmissionFactorEditDTO,
          ),
        };

        existingFactors.push(existingFactorId);
        fuelsAndEmissionsFactors.push(fuelsAndEmissionsFactor);
      }
    }

    return fuelsAndEmissionsFactors;
  }
}

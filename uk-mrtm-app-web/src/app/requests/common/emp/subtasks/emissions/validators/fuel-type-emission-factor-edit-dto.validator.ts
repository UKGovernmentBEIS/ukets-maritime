import { EmpBioFuels, EmpEFuels, EmpFossilFuels, EmpFuelsAndEmissionsFactors } from '@mrtm/api';

import { fuelsAndEmissionsFormFlowMap } from '@requests/common/components/emissions/fuels-and-emissions-factors-form/fuels-and-emissions-factors-form.helper';
import { EmissionFactorDTO, FuelTypeEmissionFactorEditDTO } from '@requests/common/emp/subtasks/emissions/interfaces';
import {
  FactorReferenceCodeEnum,
  FuelOriginCodeEnum,
  FuelTypeCodeEnum,
  GhgCodeEnum,
  MethodDensityBunkerCodeEnum,
  MethodDensityTankCodeEnum,
} from '@requests/common/types';
import { XmlValidator } from '@shared/validators';

export class EmpFuelTypeEmissionFactorEditDtoValidator {
  private static isFuelOriginCodeValid(value?: FuelOriginCodeEnum) {
    return XmlValidator.isEnum(value, FuelOriginCodeEnum);
  }

  private static isMethodDensityBunkerCodeValid(value?: MethodDensityBunkerCodeEnum) {
    return XmlValidator.isEnum(value, MethodDensityBunkerCodeEnum);
  }

  private static isMethodDensityTankCodeValid(value?: MethodDensityTankCodeEnum) {
    return XmlValidator.isEnum(value, MethodDensityTankCodeEnum);
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

  private static isValidFactorCompound(value?: number | string) {
    return XmlValidator.maxDecimalValidator(value, true, 12);
  }

  /**
   * Validates and transforms EmissionFactorDTO[] to Pick<EmpFuelsAndEmissionsFactors, 'methane' | 'carbonDioxide' | 'nitrousOxide'>
   * If provided EmissionFactor.factorReferenceCode === 'DEFAULT'
   * or EmissionFactor.factorReferenceCode is disabledField in fuelsAndEmissionsFormFlowMap
   * set each chemical element to its default values, bypassing EmissionFactor.ttwEF
   */
  private static transformEmissionFactorsToEmissionFactorsCompounds(
    fuelTypeEmissionFactorEditDTO?: FuelTypeEmissionFactorEditDTO,
  ): Partial<Pick<EmpFuelsAndEmissionsFactors, 'methane' | 'carbonDioxide' | 'nitrousOxide'>> {
    const emissionFactorCompounds: Partial<
      Pick<EmpFuelsAndEmissionsFactors, 'methane' | 'carbonDioxide' | 'nitrousOxide'>
    > = {};

    if (fuelTypeEmissionFactorEditDTO?.emissionFactors?.length) {
      for (const emissionFactor of fuelTypeEmissionFactorEditDTO.emissionFactors) {
        if (EmpFuelTypeEmissionFactorEditDtoValidator.isEmissionFactorValid(emissionFactor)) {
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
            emissionFactorCompounds[currentCompound] = emissionFactor?.ttwEF;
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
   * Validate and transform FuelTypeEmissionFactorEditDTO[] to EmpFuelsAndEmissionsFactors[]
   * If there is a duplication based on getUniqueEmissionFactorId it will not store it
   */
  public static transformFuelTypeEmissionFactorEditDTO(
    fuelTypeEmissionFactorEditDTOs: FuelTypeEmissionFactorEditDTO[],
  ): Partial<EmpFossilFuels | EmpBioFuels | EmpEFuels>[] {
    const fuelsAndEmissionsFactors: Partial<EmpFossilFuels | EmpBioFuels | EmpEFuels>[] = [];
    const existingFactors: string[] = [];

    if (fuelTypeEmissionFactorEditDTOs?.length) {
      for (const fuelTypeEmissionFactorEditDTO of fuelTypeEmissionFactorEditDTOs) {
        const existingFactorId = this.getUniqueEmissionFactorId(fuelTypeEmissionFactorEditDTO);

        if (existingFactors.includes(existingFactorId)) {
          break;
        }

        let fuelsAndEmissionsFactor: Partial<EmpFossilFuels | EmpBioFuels | EmpEFuels> = {
          uniqueIdentifier: crypto.randomUUID(),
        };

        if (
          EmpFuelTypeEmissionFactorEditDtoValidator.isFuelOriginCodeValid(fuelTypeEmissionFactorEditDTO?.fuelOriginCode)
        ) {
          fuelsAndEmissionsFactor.origin = fuelTypeEmissionFactorEditDTO.fuelOriginCode;
        }

        if (
          EmpFuelTypeEmissionFactorEditDtoValidator.isFuelTypeCodeValid(
            fuelTypeEmissionFactorEditDTO?.fuelTypeCode,
            fuelTypeEmissionFactorEditDTO?.fuelOriginCode,
          )
        ) {
          fuelsAndEmissionsFactor.type = fuelTypeEmissionFactorEditDTO.fuelTypeCode;
        }

        if (fuelTypeEmissionFactorEditDTO?.fuelTypeCode === FuelTypeCodeEnum.OTHER) {
          fuelsAndEmissionsFactor.name = fuelTypeEmissionFactorEditDTO.otherFuelType;
        }

        if (
          EmpFuelTypeEmissionFactorEditDtoValidator.isMethodDensityBunkerCodeValid(
            fuelTypeEmissionFactorEditDTO?.methodDensityBunkerCode,
          )
        ) {
          fuelsAndEmissionsFactor.densityMethodBunker = fuelTypeEmissionFactorEditDTO.methodDensityBunkerCode;
        }

        if (
          EmpFuelTypeEmissionFactorEditDtoValidator.isMethodDensityTankCodeValid(
            fuelTypeEmissionFactorEditDTO?.methodDensityTankCode,
          )
        ) {
          fuelsAndEmissionsFactor.densityMethodTank = fuelTypeEmissionFactorEditDTO.methodDensityTankCode;
        }

        fuelsAndEmissionsFactor = {
          ...fuelsAndEmissionsFactor,
          ...EmpFuelTypeEmissionFactorEditDtoValidator.transformEmissionFactorsToEmissionFactorsCompounds(
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

import { AerFuelsAndEmissionsFactors } from '@mrtm/api';

import {
  EmissionFactorDTO,
  FuelTypeEmissionFactorEditDTO,
} from '@requests/common/aer/subtasks/aer-emissions/interfaces';
import { fuelsAndEmissionsFormFlowMap } from '@requests/common/components/emissions/fuels-and-emissions-factors-form/fuels-and-emissions-factors-form.helper';
import { FactorReferenceCodeEnum, GhgCodeEnum } from '@requests/common/types';
import { XmlValidator } from '@shared/validators';

export class AerEmissionFactorDtoValidator {
  private static isFactorReferenceCodeValid(value?: EmissionFactorDTO) {
    return XmlValidator.isEnum(value?.factorReferenceCode, FactorReferenceCodeEnum);
  }

  private static isGHGCodeValid(value?: EmissionFactorDTO) {
    return XmlValidator.isEnum(value?.ghgCode, GhgCodeEnum);
  }

  private static isTTWEFValid(value?: EmissionFactorDTO) {
    return value?.factorReferenceCode === FactorReferenceCodeEnum.DEFINED_BY_USER
      ? XmlValidator.maxDecimalValidator(value?.ttwEF, true, 12) && XmlValidator.isRequired(value?.ttwEF)
      : XmlValidator.isEmpty(value?.ttwEF);
  }

  private static isDefaultOnDisabled(
    value: EmissionFactorDTO,
    fuelTypeEmissionFactorEditDTO: FuelTypeEmissionFactorEditDTO,
  ) {
    return !this.isCompoundEnabled(value?.ghgCode, fuelTypeEmissionFactorEditDTO)
      ? value?.factorReferenceCode === FactorReferenceCodeEnum.DEFAULT
      : true;
  }

  private static getCompoundByGhgCode(ghgCode: GhgCodeEnum): 'methane' | 'carbonDioxide' | 'nitrousOxide' {
    switch (ghgCode) {
      case GhgCodeEnum.CH4:
        return 'methane';
      case GhgCodeEnum.CO2:
        return 'carbonDioxide';
      case GhgCodeEnum.N2O:
        return 'nitrousOxide';
      default:
        return null;
    }
  }

  private static isCompoundEnabled(
    ghgCode?: GhgCodeEnum,
    fuelTypeEmissionFactorEditDTO?: FuelTypeEmissionFactorEditDTO,
  ): boolean {
    const currentCompound = this.getCompoundByGhgCode(ghgCode);

    return !fuelsAndEmissionsFormFlowMap?.[fuelTypeEmissionFactorEditDTO?.fuelOriginCode]?.[
      fuelTypeEmissionFactorEditDTO?.fuelTypeCode
    ]?.disabledFields?.includes(currentCompound);
  }

  private static isEmissionFactorValid(
    value?: EmissionFactorDTO,
    fuelTypeEmissionFactorEditDTO?: FuelTypeEmissionFactorEditDTO,
  ): boolean {
    return (
      this.isFactorReferenceCodeValid(value) &&
      this.isGHGCodeValid(value) &&
      this.isTTWEFValid(value) &&
      this.isDefaultOnDisabled(value, fuelTypeEmissionFactorEditDTO)
    );
  }

  /**
   * Validates that all EmissionFactorDTO[] are valid and also that all GhgCode[] are included and unique
   */
  public static areEmissionFactorDTOsValid(fuelTypeEmissionFactorEditDTO: FuelTypeEmissionFactorEditDTO): boolean {
    const requiredGhgCodes = Object.values(GhgCodeEnum);
    const existingGhgCodes: GhgCodeEnum[] = fuelTypeEmissionFactorEditDTO?.emissionFactors?.map(
      (emissionFactor) => emissionFactor?.ghgCode,
    );

    const emissionFactorsLengthValid = fuelTypeEmissionFactorEditDTO?.emissionFactors?.length > 0;
    const ghgCodesLengthValid = existingGhgCodes?.length === requiredGhgCodes?.length;
    const uniqueGhgCodesValid = requiredGhgCodes.every((code) => existingGhgCodes?.includes(code));
    const emissionFactorsValid = fuelTypeEmissionFactorEditDTO?.emissionFactors?.every((emissionFactor) =>
      this.isEmissionFactorValid(emissionFactor, fuelTypeEmissionFactorEditDTO),
    );

    return emissionFactorsLengthValid && ghgCodesLengthValid && uniqueGhgCodesValid && emissionFactorsValid;
  }

  /**
   * Transforms EmissionFactorDTO[] to Pick<AerFuelsAndEmissionsFactors, 'methane' | 'carbonDioxide' | 'nitrousOxide'>
   * If EmissionFactor.factorReferenceCode === 'DEFAULT' set each chemical element to its default value
   * Assumes that EmissionFactorDTO[] are valid at this point
   */
  public static transformEmissionFactorsToEmissionFactorsCompounds(
    fuelTypeEmissionFactorEditDTO: FuelTypeEmissionFactorEditDTO,
  ): Pick<AerFuelsAndEmissionsFactors, 'methane' | 'carbonDioxide' | 'nitrousOxide'> {
    const emissionFactorCompounds = {} as Pick<
      AerFuelsAndEmissionsFactors,
      'methane' | 'carbonDioxide' | 'nitrousOxide'
    >;

    for (const emissionFactor of fuelTypeEmissionFactorEditDTO.emissionFactors) {
      const originCode = fuelTypeEmissionFactorEditDTO.fuelOriginCode;
      const fuelTypeCode = fuelTypeEmissionFactorEditDTO.fuelTypeCode;
      const currentCompound = this.getCompoundByGhgCode(emissionFactor.ghgCode);

      emissionFactorCompounds[currentCompound] =
        emissionFactor?.factorReferenceCode === FactorReferenceCodeEnum.DEFAULT
          ? fuelsAndEmissionsFormFlowMap?.[originCode]?.[fuelTypeCode].data?.[currentCompound]
          : (emissionFactorCompounds[currentCompound] = emissionFactor.ttwEF);
    }

    return emissionFactorCompounds;
  }
}

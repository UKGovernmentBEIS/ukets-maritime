import { AerFuelsAndEmissionsFactors, EmissionsSources } from '@mrtm/api';

import {
  EmissionReportDetailsDTO,
  EmissionSourceEditDTO,
  FuelTypeCodeDTO,
  FuelTypeEmissionFactorEditDTO,
} from '@requests/common/aer/subtasks/aer-emissions/interfaces';
import { AerFuelsAndEmissionsFactorsExtended } from '@requests/common/components/emissions/fuels-and-emissions-factors-form/fuels-and-emissions-factors-form.types';
import {
  EmissionSourceClassCodeEnum,
  EmissionSourceTypeCodeEnum,
  FuelTypeCodeEnum,
  MonitoringMethodCodeEnum,
} from '@requests/common/types';
import { getFuelKey } from '@requests/common/utils/emissions';
import { EMISSION_SOURCES_METHANE_SLIP_SELECT_ITEMS } from '@shared/constants';
import { AllFuelOriginTypeName, AllFuels, XmlResult } from '@shared/types';
import { isLNG, isNil } from '@shared/utils';
import { XmlValidator } from '@shared/validators';

export class AerEmissionSourceEditDtoValidator {
  private static isEmissionSourceNameValid(value?: EmissionSourceEditDTO['name']): boolean {
    return XmlValidator.isRequired(value) && XmlValidator.isString(value) && XmlValidator.maxLength(value, 255);
  }

  private static isEmissionSourceTypeCodeValid(value?: EmissionSourceTypeCodeEnum): boolean {
    return XmlValidator.isEnum(value, EmissionSourceTypeCodeEnum);
  }

  private static isEmissionSourceClassCodeValid(value?: EmissionSourceClassCodeEnum): boolean {
    return XmlValidator.isEnum(value, EmissionSourceClassCodeEnum);
  }

  private static isMonitoringMethodCodeValid(value?: MonitoringMethodCodeEnum): boolean {
    return XmlValidator.isEnum(value, MonitoringMethodCodeEnum);
  }

  private static isSlipPercentageValid(fuel: AllFuels, value?: number): boolean {
    return isLNG(fuel) ? XmlValidator.min(value, 0) && XmlValidator.max(value, 1) : XmlValidator.isEmpty(value);
  }

  private static getExistingEmissionFactor(
    fuelTypeCode?: FuelTypeCodeDTO,
    fuelsEmissionsFactors?: AerFuelsAndEmissionsFactorsExtended[],
  ) {
    return fuelsEmissionsFactors?.find((fuelEmissionFactor) =>
      fuelTypeCode?.fuelTypeCode === FuelTypeCodeEnum.OTHER
        ? fuelTypeCode?.fuelTypeCode === fuelEmissionFactor?.type &&
          fuelTypeCode?.otherFuelType?.toUpperCase() === fuelEmissionFactor?.name?.toUpperCase()
        : fuelTypeCode?.fuelTypeCode === fuelEmissionFactor?.type,
    );
  }

  /**
   * Transforms a decimal value to percentage, keeping 2 decimals, without rounding
   * e.x. 0.0564 => 5.64
   */
  private static transformSlipPercentage(value?: number): string {
    const percentage = value * 100;
    return String(parseInt(String(percentage * 100)) / 100);
  }

  /**
   * Validates that all FuelTypeCodeDTO[] are valid, based on already mapped AerFuelsAndEmissionsFactors[]
   */
  private static areFuelTypeCodeDTOsValid(
    fuelTypeCodes?: FuelTypeCodeDTO[],
    fuelsEmissionsFactors?: AerFuelsAndEmissionsFactorsExtended[],
  ) {
    const uniqueIds = fuelTypeCodes?.map((fuelTypeCode) => getFuelKey(fuelTypeCode));
    const noDuplicatesValid = new Set(uniqueIds).size === uniqueIds?.length;
    const fuelTypeCodesLengthValid = fuelTypeCodes?.length > 0;
    const allFuelTypeCodesValid = fuelTypeCodes?.every((fuelTypeCode) => {
      const isFuelTypeCodeValid =
        XmlValidator.isEnum(fuelTypeCode?.fuelTypeCode, FuelTypeCodeEnum) &&
        (fuelTypeCode?.fuelTypeCode !== FuelTypeCodeEnum.OTHER
          ? XmlValidator.isEmpty(fuelTypeCode?.otherFuelType)
          : true);
      const foundEmissionFactor = this.getExistingEmissionFactor(fuelTypeCode, fuelsEmissionsFactors);
      const isSlipPercentageValid = this.isSlipPercentageValid(
        {
          uniqueIdentifier: foundEmissionFactor?.uniqueIdentifier,
          origin: foundEmissionFactor?.origin,
          type: foundEmissionFactor?.type,
          name: foundEmissionFactor?.name,
        } as AllFuels,
        fuelTypeCode?.slipPercentage,
      );

      return isFuelTypeCodeValid && foundEmissionFactor && isSlipPercentageValid;
    });

    return fuelTypeCodesLengthValid && noDuplicatesValid && allFuelTypeCodesValid;
  }

  private static areAllMonitoringMethodCodesValid(monitoringMethodCodes?: MonitoringMethodCodeEnum[]) {
    const monitoringMethodCodesLengthValid =
      XmlValidator.minLength(monitoringMethodCodes, 1) && XmlValidator.maxLength(monitoringMethodCodes, 4);
    const allMonitoringMethodCodes = monitoringMethodCodes?.map((monitoringMethodCode) => monitoringMethodCode);
    const hasNoDuplicateMethodCode = new Set(allMonitoringMethodCodes).size === allMonitoringMethodCodes?.length;
    const allMonitoringMethodCodesValid = monitoringMethodCodes?.every((monitoringMethodCode) =>
      this.isMonitoringMethodCodeValid(monitoringMethodCode),
    );
    return monitoringMethodCodesLengthValid && allMonitoringMethodCodesValid && hasNoDuplicateMethodCode;
  }

  /**
   * Validates all EmissionSourceEditDTO[], including basic property validation,
   * duplication and inclusion in FuelTypeEmissionFactorEditDTO[]
   */
  private static areEmissionSourceEditDTOsValid(
    emissionDTOs?: EmissionSourceEditDTO[],
    fuelDTOs?: FuelTypeEmissionFactorEditDTO[],
    aerFuelsAndEmissionsFactors?: AerFuelsAndEmissionsFactors[],
  ): boolean {
    const uniqueIds = emissionDTOs?.map((emissionDTO) =>
      Array.isArray(emissionDTO?.name) ? emissionDTO?.name[0]?.toUpperCase() : emissionDTO?.name?.toUpperCase(),
    );
    const noDuplicatesValid = new Set(uniqueIds).size === uniqueIds?.length;
    const emissionsLengthValid = XmlValidator.minLength(emissionDTOs, 1);
    const allFuelsTypeCodes = fuelDTOs?.map((fuelDTO) => getFuelKey(fuelDTO));
    const allEmissionFuelTypeCodes = emissionDTOs?.flatMap((emissionDTO) =>
      emissionDTO?.fuelTypeCodes?.map((fuelTypeCode) => getFuelKey(fuelTypeCode)),
    );
    const fuelsExistInEmissionsValid = allFuelsTypeCodes?.every((fuelTypeCode) =>
      allEmissionFuelTypeCodes?.includes(fuelTypeCode),
    );
    const allEmissionsValid = emissionDTOs?.every(
      (emissionDTO) =>
        this.isEmissionSourceNameValid(emissionDTO?.name) &&
        noDuplicatesValid &&
        this.isEmissionSourceTypeCodeValid(emissionDTO?.emissionSourceTypeCode) &&
        this.isEmissionSourceClassCodeValid(emissionDTO?.emissionSourceClassCode) &&
        this.areFuelTypeCodeDTOsValid(
          emissionDTO?.fuelTypeCodes,
          aerFuelsAndEmissionsFactors as AerFuelsAndEmissionsFactorsExtended[],
        ) &&
        fuelsExistInEmissionsValid &&
        this.areAllMonitoringMethodCodesValid(emissionDTO?.monitoringMethodCode),
    );

    return emissionsLengthValid && allEmissionsValid;
  }

  /**
   * Transforms FuelTypeCodeDTO[] to AllFuelOriginTypeName[]
   * Assumes that fuelTypeCodes, fuelsEmissionsFactors are valid at this point
   */
  private static transformFuelTypeCodeDTOs(
    fuelTypeCodes: FuelTypeCodeDTO[],
    fuelsEmissionsFactors: AerFuelsAndEmissionsFactorsExtended[],
  ): AllFuelOriginTypeName[] {
    return fuelTypeCodes?.map((fuelTypeCode) => {
      const foundEmissionFactor = this.getExistingEmissionFactor(fuelTypeCode, fuelsEmissionsFactors);
      const methaneSlipValue = !isNil(fuelTypeCode?.slipPercentage)
        ? this.transformSlipPercentage(fuelTypeCode.slipPercentage)
        : null;
      const methaneSlipValueType = methaneSlipValue
        ? EMISSION_SOURCES_METHANE_SLIP_SELECT_ITEMS.find(
            (methaneSlipItem) => methaneSlipItem.value === methaneSlipValue,
          )
          ? 'PRESELECTED'
          : 'OTHER'
        : null;

      return {
        uniqueIdentifier: foundEmissionFactor.uniqueIdentifier,
        origin: foundEmissionFactor.origin,
        type: foundEmissionFactor.type,
        name: foundEmissionFactor?.name ? foundEmissionFactor.name : null,
        methaneSlip: methaneSlipValue,
        methaneSlipValueType: methaneSlipValueType,
      };
    });
  }

  /**
   * Transforms EmissionSourceEditDTO[] to EmissionsSources[],
   * taking into account the already transformed AerFuelsAndEmissionsFactors[]
   * Assumes that all EmissionSourceEditDTO[] are valid and AerFuelsAndEmissionsFactors[] exist at this point
   */
  private static transformEmissionSourceEditDTOs(
    emissionDTOs: EmissionSourceEditDTO[],
    aerFuelsAndEmissionsFactors: AerFuelsAndEmissionsFactors[],
  ): EmissionsSources[] {
    return emissionDTOs.map((emissionDTO) => ({
      uniqueIdentifier: crypto.randomUUID(),
      name: emissionDTO.name,
      type: emissionDTO.emissionSourceTypeCode,
      sourceClass: emissionDTO.emissionSourceClassCode,
      fuelDetails: this.transformFuelTypeCodeDTOs(
        emissionDTO.fuelTypeCodes,
        aerFuelsAndEmissionsFactors as AerFuelsAndEmissionsFactorsExtended[],
      ),
      monitoringMethod: emissionDTO.monitoringMethodCode,
    }));
  }

  /**
   * Validates EmissionSourceEditDTO[] and returns XmlResult<EmissionsSources[]>
   * This should be explicitly called and displayed after validateCoreEmissionReportDetailsDTOs is valid
   */
  public static validateEmissionSourceEditDTOs(
    emissionReportDetails?: EmissionReportDetailsDTO,
    aerFuelsAndEmissionsFactors?: AerFuelsAndEmissionsFactors[],
  ): XmlResult<EmissionsSources[]> {
    const emissionDTOs = emissionReportDetails?.emissionSources?.emissionSourceEntry;
    const fuelDTOs = emissionReportDetails?.fuelTypes?.fuelTypeEntry;
    if (this.areEmissionSourceEditDTOsValid(emissionDTOs, fuelDTOs, aerFuelsAndEmissionsFactors)) {
      return {
        data: this.transformEmissionSourceEditDTOs(emissionDTOs, aerFuelsAndEmissionsFactors),
      };
    }

    return {
      errors: [
        {
          row: emissionReportDetails.name,
          column: 'NO_FIELD',
          message:
            'There are errors in the emissions sources and fuel types used data you uploaded. Check the information entered and reupload the file',
        },
      ],
    };
  }
}

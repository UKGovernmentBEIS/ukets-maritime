import {
  AerFuelsAndEmissionsFactors,
  EmissionsSources,
  EmpFuelsAndEmissionsFactors,
  FuelOriginBiofuelTypeName,
  FuelOriginEFuelTypeName,
  FuelOriginFossilTypeName,
} from '@mrtm/api';

import { EmissionSourceEditDTO, FuelTypeCodeDTO } from '@requests/common/aer/subtasks/aer-emissions/interfaces';
import {
  EmissionSourceClassCodeEnum,
  EmissionSourceTypeCodeEnum,
  FuelTypeCodeEnum,
  MonitoringMethodCodeEnum,
} from '@requests/common/types';
import { EMISSION_SOURCES_METHANE_SLIP_SELECT_ITEMS } from '@shared/constants';
import { AllFuels, BioFuels, EFuels, FossilFuels } from '@shared/types';
import { isLNG } from '@shared/utils';
import { XmlValidator } from '@shared/validators';

export class AerEmissionSourceEditDtoValidator {
  private static isEmissionNameValid(value?: EmissionSourceEditDTO['name']) {
    return XmlValidator.maxLength(value, 255);
  }

  private static isEmissionSourceTypeCodeValid(value?: EmissionSourceTypeCodeEnum) {
    return XmlValidator.isEnum(value, EmissionSourceTypeCodeEnum);
  }

  private static isEmissionSourceClassCodeValid(value?: EmissionSourceClassCodeEnum) {
    return XmlValidator.isEnum(value, EmissionSourceClassCodeEnum);
  }

  private static isMonitoringMethodCodeValid(value?: MonitoringMethodCodeEnum) {
    return XmlValidator.isEnum(value, MonitoringMethodCodeEnum);
  }

  private static isSlipPercentageValid(fuel: AllFuels, value?: number) {
    return isLNG(fuel) && XmlValidator.min(value, 0) && XmlValidator.max(value, 1);
  }

  /**
   * Transforms a decimal value to percentage, keeping 2 decimals, without rounding
   * e.x. 0.0564 => 5.64
   */
  private static transformSlipPercentage(value?: number): string {
    const percentage = value * 100;
    return String(parseInt(String(percentage * 100)) / 100);
  }

  private static getExistingFuelTypeCode(
    value?: FuelTypeCodeDTO,
    emissionFactors?: Partial<FossilFuels | BioFuels | EFuels>[],
  ): FuelOriginBiofuelTypeName | FuelOriginEFuelTypeName | FuelOriginFossilTypeName | null {
    const isValidEnum = XmlValidator.isEnum(value?.fuelTypeCode, FuelTypeCodeEnum);
    const foundEmissionFactor = emissionFactors?.find((emissionFactor) => {
      return value?.fuelTypeCode === FuelTypeCodeEnum.OTHER
        ? value?.fuelTypeCode === emissionFactor?.type && value?.otherFuelType === emissionFactor?.name
        : value?.fuelTypeCode === emissionFactor?.type;
    });

    if (isValidEnum && foundEmissionFactor?.uniqueIdentifier && foundEmissionFactor?.origin) {
      const fuelOriginTypeName: FuelOriginBiofuelTypeName | FuelOriginEFuelTypeName | FuelOriginFossilTypeName = {
        uniqueIdentifier: foundEmissionFactor.uniqueIdentifier,
        origin: foundEmissionFactor.origin,
        type: foundEmissionFactor.type,
        name: foundEmissionFactor?.name,
      };

      if (this.isSlipPercentageValid(fuelOriginTypeName as AllFuels, value?.slipPercentage)) {
        const methaneSlipValue = this.transformSlipPercentage(value.slipPercentage);
        fuelOriginTypeName.methaneSlip = methaneSlipValue;
        fuelOriginTypeName.methaneSlipValueType = EMISSION_SOURCES_METHANE_SLIP_SELECT_ITEMS.find(
          (methaneSlipItem) => methaneSlipItem.value === methaneSlipValue,
        )
          ? 'PRESELECTED'
          : 'OTHER';
      }

      return fuelOriginTypeName;
    }

    return null;
  }

  private static transformFuelTypeCodes = (
    fuelTypeCodes?: FuelTypeCodeDTO[],
    emissionFactors?: Partial<EmpFuelsAndEmissionsFactors>[],
  ) => {
    const fuelDetails: Array<FuelOriginBiofuelTypeName | FuelOriginEFuelTypeName | FuelOriginFossilTypeName> = [];
    const existingFuelTypeCodes: string[] = [];

    if (fuelTypeCodes?.length) {
      for (const fuelTypeCode of fuelTypeCodes) {
        if (existingFuelTypeCodes.includes(`${fuelTypeCode.fuelTypeCode}-${fuelTypeCode.otherFuelType}`)) {
          break;
        }

        const fuelDetailsItem = this.getExistingFuelTypeCode(fuelTypeCode, emissionFactors);
        if (fuelDetailsItem) {
          existingFuelTypeCodes.push(`${fuelTypeCode.fuelTypeCode}-${fuelTypeCode.otherFuelType}`);
          fuelDetails.push(fuelDetailsItem);
        }
      }
    }

    return fuelDetails;
  };

  private static transformMonitoringMethodCodes = (monitoringMethodCodes?: MonitoringMethodCodeEnum[]) => {
    const aerMonitoringMethods: Array<'BDN' | 'BUNKER_TANK' | 'FLOW_METERS' | 'DIRECT'> = [];

    if (monitoringMethodCodes?.length) {
      for (const monitoringMethodCode of monitoringMethodCodes) {
        if (aerMonitoringMethods.includes(monitoringMethodCode)) {
          break;
        }
        if (this.isMonitoringMethodCodeValid(monitoringMethodCode)) {
          aerMonitoringMethods.push(monitoringMethodCode);
        }
      }
    }

    return aerMonitoringMethods;
  };

  /**
   * Validate and transform EmissionSourceEditDTO to EmissionsSources[]
   */
  public static transformEmissionSourceEditDTOs(
    emissionDTOs?: EmissionSourceEditDTO[],
    emissionFactors?: Partial<AerFuelsAndEmissionsFactors>[],
  ): Partial<EmissionsSources>[] {
    const emissionSources: Partial<EmissionsSources>[] = [];

    if (emissionDTOs?.length) {
      for (const emissionDTO of emissionDTOs) {
        if (emissionSources.map((item) => item.name).includes(emissionDTO.name)) {
          break;
        }

        const emissionSource: Partial<EmissionsSources> = {
          uniqueIdentifier: crypto.randomUUID(),
        };

        if (this.isEmissionNameValid(emissionDTO?.name)) {
          emissionSource.name = emissionDTO.name;
        }

        if (this.isEmissionSourceTypeCodeValid(emissionDTO?.emissionSourceTypeCode)) {
          emissionSource.type = emissionDTO.emissionSourceTypeCode;
        }

        if (this.isEmissionSourceClassCodeValid(emissionDTO?.emissionSourceClassCode)) {
          emissionSource.sourceClass = emissionDTO.emissionSourceClassCode;
        }

        emissionSource.fuelDetails = this.transformFuelTypeCodes(emissionDTO?.fuelTypeCodes, emissionFactors);
        emissionSource.monitoringMethod = this.transformMonitoringMethodCodes(emissionDTO?.monitoringMethodCode);

        emissionSources.push(emissionSource);
      }
    }

    return emissionSources;
  }
}

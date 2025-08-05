import { AerShipDetails, AerShipEmissions } from '@mrtm/api';

import { EmissionReportDetailsDTO } from '@requests/common/aer/subtasks/aer-emissions/interfaces';
import { shouldShowHasIceClassDerogation } from '@requests/common/components/emissions';
import { FlagEnum, IceClassPolarCodeEnum, NatureEnum, ShipTypeEnum } from '@requests/common/types';
import { XmlValidationError } from '@shared/types';
import { XmlValidator } from '@shared/validators';

export class EmissionReportDetailsDtoValidator {
  private static isShipImoNumberValid = (value?: EmissionReportDetailsDTO['shipImoNumber']): boolean => {
    const shipImoNumberRegex = new RegExp('^\\d{7}$');
    return shipImoNumberRegex.test(value);
  };

  private static isShipUnique = (
    aerShipEmissions: AerShipEmissions[],
    value?: EmissionReportDetailsDTO['shipImoNumber'],
  ): boolean => {
    const allImoNumbers = aerShipEmissions?.map((item) => item?.details?.imoNumber);
    return !allImoNumbers.includes(value?.toString());
  };

  private static isNameValid = (value?: EmissionReportDetailsDTO['name']): boolean => {
    return XmlValidator.isRequired(value) && XmlValidator.maxLength(value, 30);
  };

  private static isShipTypeValid = (value?: EmissionReportDetailsDTO['shipType']): boolean => {
    return XmlValidator.isEnum(value, ShipTypeEnum);
  };

  private static isGrossTonnageValid = (value?: EmissionReportDetailsDTO['grossTonnage']): boolean => {
    return value !== undefined && XmlValidator.min(value, 5000) && XmlValidator.max(value, 999999999);
  };

  private static isFlagValid = (value?: EmissionReportDetailsDTO['flag']): boolean => {
    return XmlValidator.isEnum(value, FlagEnum);
  };

  private static isIceClassPolarCodeValid = (value?: EmissionReportDetailsDTO['iceClassPolarCode']): boolean => {
    return XmlValidator.isEnum(value, IceClassPolarCodeEnum);
  };

  private static isNatureValid(value?: NatureEnum) {
    return XmlValidator.isEnum(value, NatureEnum);
  }

  private static isIceClassSurrenderReductionValid(value?: EmissionReportDetailsDTO['iceClassSurrenderReduction']) {
    return XmlValidator.isBoolean(value);
  }

  private static isAllYearValid(value?: EmissionReportDetailsDTO['allYear']) {
    return XmlValidator.isBoolean(value);
  }

  private static isPartialPeriodFromDateValid(
    reportingYear: string,
    value?: EmissionReportDetailsDTO['partialPeriodFromDate'],
  ) {
    const year = value?.split('-')?.[0];
    return XmlValidator.isDate(value) && year === reportingYear;
  }

  private static isPartialPeriodToDateValid(
    reportingYear: string,
    value?: EmissionReportDetailsDTO['partialPeriodToDate'],
  ) {
    const year = value?.split('-')?.[0];
    return XmlValidator.isDate(value) && year === reportingYear;
  }

  /**
   * Validates and transform the following non-significant properties from EmissionReportDetailsDTO to AerShipDetails
   * grossTonnage, flagState, iceClass, natureOfReportingResponsibility
   */
  public static transformShipParticularDTO(
    emissionReport: EmissionReportDetailsDTO,
    reportingYear: string,
  ): Partial<AerShipDetails> {
    const result: Partial<AerShipDetails> = {
      imoNumber: emissionReport.shipImoNumber?.toString(),
      name: emissionReport.name,
      type: emissionReport.shipType,
    };

    if (this.isGrossTonnageValid(emissionReport?.grossTonnage)) {
      result.grossTonnage = emissionReport.grossTonnage;
    }

    if (this.isFlagValid(emissionReport?.flag)) {
      result.flagState = emissionReport.flag;
    }

    if (this.isIceClassPolarCodeValid(emissionReport?.iceClassPolarCode)) {
      result.iceClass = emissionReport.iceClassPolarCode;
    }

    if (
      shouldShowHasIceClassDerogation(result?.iceClass) &&
      this.isIceClassSurrenderReductionValid(emissionReport?.iceClassSurrenderReduction)
    ) {
      result.hasIceClassDerogation = emissionReport.iceClassSurrenderReduction;
    }

    if (this.isAllYearValid(emissionReport?.allYear)) {
      result.allYear = emissionReport.allYear;
      if (result.allYear === false) {
        if (this.isPartialPeriodFromDateValid(reportingYear, emissionReport?.partialPeriodFromDate)) {
          result.from = emissionReport.partialPeriodFromDate;
        }
        if (this.isPartialPeriodToDateValid(reportingYear, emissionReport?.partialPeriodToDate)) {
          result.to = emissionReport.partialPeriodToDate;
        }
      }
    }

    if (this.isNatureValid(emissionReport?.company?.nature)) {
      result.natureOfReportingResponsibility = emissionReport.company.nature;
    }

    return result;
  }

  public static shipParticularsDTOPartiallyErrors = (
    index: number,
    aerShipEmissions: AerShipEmissions[],
    emissionReport?: EmissionReportDetailsDTO,
  ): XmlValidationError[] => {
    const errors: XmlValidationError[] = [];

    if (!this.isShipUnique(aerShipEmissions, emissionReport?.shipImoNumber)) {
      errors.push({ row: index + 1, column: 'shipImoNumber', message: 'There are duplicated IMO numbers in the file' });
    }

    if (!this.isShipImoNumberValid(emissionReport?.shipImoNumber)) {
      errors.push({
        row: index + 1,
        column: 'shipImoNumber',
        message: 'The IMO Number must be 7 digits and is required',
      });
    }

    if (!this.isNameValid(emissionReport?.name)) {
      errors.push({
        row: index + 1,
        column: 'name',
        message: 'The Ship Name is required and must be less than 30 characters',
      });
    }

    if (!this.isShipTypeValid(emissionReport?.shipType)) {
      errors.push({ row: index + 1, column: 'shipType', message: 'The Ship Type is invalid' });
    }

    return errors;
  };

  /**
   * Validates whether the XML contains more than 1000 EmissionReportDetailsDTO.
   * Validation should happen after all generic file validations, but before any other validation for EmissionReportDetailsDTO.
   */
  public static maxAllowedShipsErrors(emissionReports: EmissionReportDetailsDTO[]): XmlValidationError[] {
    const errors: XmlValidationError[] = [];

    if (emissionReports?.length > 1000) {
      errors.push({ row: null, column: null, message: 'The maximum number of ships allowed is 1000' });
    }

    return errors;
  }
}

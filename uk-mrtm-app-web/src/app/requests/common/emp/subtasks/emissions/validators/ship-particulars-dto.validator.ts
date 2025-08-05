import { EmpShipEmissions, ShipDetails } from '@mrtm/api';

import { ShipParticularsDTO } from '@requests/common/emp/subtasks/emissions/interfaces';
import { CompanyDtoValidator } from '@requests/common/emp/subtasks/emissions/validators';
import { FlagEnum, IceClassPolarCodeEnum, ShipTypeEnum } from '@requests/common/types';
import { XmlValidationError } from '@shared/types';
import { XmlValidator } from '@shared/validators';

export class ShipParticularsDTOValidator {
  private static isShipImoNumberValid = (value?: ShipParticularsDTO['shipImoNumber']): boolean => {
    const shipImoNumberRegex = new RegExp('^\\d{7}$');
    return shipImoNumberRegex.test(value);
  };

  private static isShipUnique = (
    empShipEmissions: EmpShipEmissions[],
    value?: ShipParticularsDTO['shipImoNumber'],
  ): boolean => {
    const allImoNumbers = empShipEmissions?.map((item) => item?.details?.imoNumber);
    return !allImoNumbers.includes(value?.toString());
  };

  private static isNameValid = (value?: ShipParticularsDTO['name']): boolean => {
    return XmlValidator.isRequired(value) && XmlValidator.maxLength(value, 30);
  };

  private static isShipTypeValid = (value?: ShipParticularsDTO['shipType']): boolean => {
    return XmlValidator.isEnum(value, ShipTypeEnum);
  };

  private static isGrossTonnageValid = (value?: ShipParticularsDTO['grossTonnage']): boolean => {
    return value !== undefined && XmlValidator.min(value, 5000) && XmlValidator.max(value, 999999999);
  };

  private static isFlagValid = (value?: ShipParticularsDTO['flag']): boolean => {
    return XmlValidator.isEnum(value, FlagEnum);
  };

  private static isIceClassPolarCodeValid = (value?: ShipParticularsDTO['iceClassPolarCode']): boolean => {
    return XmlValidator.isEnum(value, IceClassPolarCodeEnum);
  };

  /**
   * Validates and transform the following non-significant properties from ShipParticularsDTO to ShipDetails
   * grossTonnage, flagState, iceClass, natureOfReportingResponsibility
   */
  public static transformShipParticularDTO(shipParticular: ShipParticularsDTO): Partial<ShipDetails> {
    const result: Partial<ShipDetails> = {
      imoNumber: shipParticular.shipImoNumber?.toString(),
      name: shipParticular.name,
      type: shipParticular.shipType,
    };

    if (this.isGrossTonnageValid(shipParticular?.grossTonnage)) {
      result.grossTonnage = shipParticular.grossTonnage;
    }

    if (this.isFlagValid(shipParticular?.flag)) {
      result.flagState = shipParticular.flag;
    }

    if (this.isIceClassPolarCodeValid(shipParticular?.iceClassPolarCode)) {
      result.iceClass = shipParticular.iceClassPolarCode;
    }

    if (CompanyDtoValidator.isNatureValid(shipParticular?.company?.nature)) {
      result.natureOfReportingResponsibility = shipParticular.company.nature;
    }

    return result;
  }

  public static shipParticularsDTOPartiallyErrors = (
    index: number,
    empShipEmissions: EmpShipEmissions[],
    shipParticularsDTO?: ShipParticularsDTO,
  ): XmlValidationError[] => {
    const errors: XmlValidationError[] = [];

    if (!this.isShipUnique(empShipEmissions, shipParticularsDTO?.shipImoNumber)) {
      errors.push({ row: index + 1, column: 'shipImoNumber', message: 'There are duplicated IMO numbers in the file' });
    }

    if (!this.isShipImoNumberValid(shipParticularsDTO?.shipImoNumber)) {
      errors.push({
        row: index + 1,
        column: 'shipImoNumber',
        message: 'The IMO Number must be 7 digits and is required',
      });
    }

    if (!this.isNameValid(shipParticularsDTO?.name)) {
      errors.push({
        row: index + 1,
        column: 'name',
        message: 'The Ship Name is required and must be less than 30 characters',
      });
    }

    if (!this.isShipTypeValid(shipParticularsDTO?.shipType)) {
      errors.push({ row: index + 1, column: 'shipType', message: 'The Ship Type is invalid' });
    }

    return errors;
  };

  /**
   * Validates whether the XML contains more than 1000 ShipParticularsDTO.
   * Validation should happen after all generic file validations, but before any other validation for ShipParticular.
   */
  public static maxAllowedShipsErrors(shipParticulars: ShipParticularsDTO[]): XmlValidationError[] {
    const errors: XmlValidationError[] = [];

    if (shipParticulars?.length > 1000) {
      errors.push({ row: null, column: null, message: 'The maximum number of ships allowed is 1000' });
    }

    return errors;
  }
}

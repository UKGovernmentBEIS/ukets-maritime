import { isAfter } from 'date-fns';

import { AerShipDetails } from '@mrtm/api';

import { EmissionReportDetailsDTO } from '@requests/common/aer/subtasks/aer-emissions/interfaces';
import { FlagEnum, IceClassPolarCodeEnum, NatureEnum, ShipTypeEnum } from '@requests/common/types';
import { XmlResult, XmlValidationError } from '@shared/types';
import { XmlValidator } from '@shared/validators';

export class AerEmissionReportDetailsDtoValidator {
  private static isShipImoNumberValid(value?: EmissionReportDetailsDTO['shipImoNumber']): boolean {
    const shipImoNumberRegex = new RegExp('^\\d{7}$');
    return shipImoNumberRegex.test(value);
  }

  private static isShipUnique(
    existingImoNumbers: string[],
    value?: EmissionReportDetailsDTO['shipImoNumber'],
  ): boolean {
    return !existingImoNumbers.includes(value?.toString());
  }

  private static isNameValid(value?: EmissionReportDetailsDTO['name']): boolean {
    return XmlValidator.isRequired(value) && XmlValidator.isString(value) && XmlValidator.maxLength(value, 30);
  }

  private static isShipTypeValid(value?: EmissionReportDetailsDTO['shipType']): boolean {
    return XmlValidator.isEnum(value, ShipTypeEnum);
  }

  private static isGrossTonnageValid(value?: EmissionReportDetailsDTO['grossTonnage']): boolean {
    return XmlValidator.min(value, 5000) && XmlValidator.max(value, 999999999);
  }

  private static isFlagValid(value?: EmissionReportDetailsDTO['flag']): boolean {
    return XmlValidator.isEnum(value, FlagEnum);
  }

  private static isIceClassPolarCodeValid(value?: EmissionReportDetailsDTO['iceClassPolarCode']): boolean {
    return XmlValidator.isEnum(value, IceClassPolarCodeEnum);
  }

  private static isNatureValid(value?: NatureEnum): boolean {
    return XmlValidator.isEnum(value, NatureEnum);
  }

  private static isPartialPeriodDateValid(
    reportingYear: string,
    value?: EmissionReportDetailsDTO['partialPeriodFromDate'] | EmissionReportDetailsDTO['partialPeriodToDate'],
  ) {
    const year = value?.split('-')?.[0];
    return XmlValidator.isDate(value) && year === reportingYear;
  }

  private static fromDateLaterThanToDateValid(
    partialPeriodFromDate?: EmissionReportDetailsDTO['partialPeriodFromDate'],
    partialPeriodToDate?: EmissionReportDetailsDTO['partialPeriodToDate'],
  ) {
    const fromDate = new Date(partialPeriodFromDate);
    const toDate = new Date(partialPeriodToDate);
    return !isAfter(fromDate, toDate);
  }

  private static isAllYearValid(reportingYear: string, emissionReportDetailsDTO?: EmissionReportDetailsDTO) {
    const allYearValidOnTrue =
      emissionReportDetailsDTO?.allYear === true &&
      XmlValidator.isEmpty(emissionReportDetailsDTO?.partialPeriodFromDate) &&
      XmlValidator.isEmpty(emissionReportDetailsDTO?.partialPeriodToDate);
    const allYearValidOnFalse =
      emissionReportDetailsDTO?.allYear === false &&
      this.isPartialPeriodDateValid(reportingYear, emissionReportDetailsDTO?.partialPeriodFromDate) &&
      this.isPartialPeriodDateValid(reportingYear, emissionReportDetailsDTO?.partialPeriodToDate) &&
      this.fromDateLaterThanToDateValid(
        emissionReportDetailsDTO?.partialPeriodFromDate,
        emissionReportDetailsDTO?.partialPeriodToDate,
      );

    return XmlValidator.isBoolean(emissionReportDetailsDTO?.allYear) && (allYearValidOnTrue || allYearValidOnFalse);
  }

  /**
   * Validates whether the XML contains more than 1000 EmissionReportDetailsDTO.
   * This should be explicitly called and displayed after all generic file validations are valid
   */
  public static validateMaxAllowedShips(missionReports?: EmissionReportDetailsDTO[]): XmlValidationError[] {
    if (missionReports?.length > 1000) {
      return [{ row: null, column: null, message: 'The maximum number of ships allowed is 1000' }];
    }

    return [];
  }
  /**
   * Validates each of EmissionReportDetailsDTO[] for unique shipImoNumber, valid shipImoNumber and valid name.
   * This should be explicitly called and displayed after validateMaxAllowedShips is valid
   */
  public static validateCoreEmissionReportDetailsDTOs(
    emissionReportDetailsDTO?: EmissionReportDetailsDTO[],
  ): XmlValidationError[] {
    const errors: XmlValidationError[] = [];
    const existingImoNumbers: string[] = [];

    emissionReportDetailsDTO?.forEach((emissionReportDetailsDTO, index) => {
      const currentShipImoNumber = emissionReportDetailsDTO?.shipImoNumber?.toString();
      if (!this.isShipUnique(existingImoNumbers, currentShipImoNumber)) {
        errors.push({
          row: index + 1,
          column: 'shipImoNumber',
          message: 'There are duplicated IMO numbers in the file. Check the information entered and reupload the file',
        });
      }
      existingImoNumbers.push(currentShipImoNumber);

      if (!this.isShipImoNumberValid(currentShipImoNumber)) {
        errors.push({
          row: index + 1,
          column: 'shipImoNumber',
          message: 'The IMO Number must be 7 digits and is required',
        });
      }

      if (!this.isNameValid(emissionReportDetailsDTO?.name)) {
        errors.push({
          row: index + 1,
          column: 'name',
          message: 'The Ship Name is required and must be less than 30 characters',
        });
      }
    });

    return errors;
  }

  /**
   * Validates and transforms from EmissionReportDetailsDTO to ShipDetails
   * This should be explicitly called and displayed after validateCoreEmissionReportDetailsDTO is valid
   */
  public static validateEmissionReportDetailsDTO(
    reportingYear: string,
    emissionReportDetails?: EmissionReportDetailsDTO,
  ): XmlResult<AerShipDetails> {
    if (
      this.isShipTypeValid(emissionReportDetails?.shipType) &&
      this.isGrossTonnageValid(emissionReportDetails?.grossTonnage) &&
      this.isFlagValid(emissionReportDetails?.flag) &&
      this.isIceClassPolarCodeValid(emissionReportDetails?.iceClassPolarCode) &&
      this.isNatureValid(emissionReportDetails?.company?.nature) &&
      this.isAllYearValid(reportingYear, emissionReportDetails)
    ) {
      return {
        data: {
          imoNumber: emissionReportDetails.shipImoNumber.toString(),
          name: emissionReportDetails.name,
          type: emissionReportDetails.shipType,
          grossTonnage: emissionReportDetails.grossTonnage,
          flagState: emissionReportDetails.flag,
          iceClass: emissionReportDetails.iceClassPolarCode,
          natureOfReportingResponsibility: emissionReportDetails.company.nature,
          allYear: emissionReportDetails.allYear,
          from: !emissionReportDetails.allYear ? emissionReportDetails.partialPeriodFromDate : null,
          to: !emissionReportDetails.allYear ? emissionReportDetails.partialPeriodToDate : null,
        },
      };
    }

    return {
      errors: [
        {
          row: emissionReportDetails.name,
          column: 'NO_FIELD',
          message:
            'There are errors in the basic ship details data you uploaded. Check the information entered and reupload the file',
        },
      ],
    };
  }
}

import { ShipDetails } from '@mrtm/api';

import { ShipParticularsDTO } from '@requests/common/emp/subtasks/emissions/interfaces';
import { FlagEnum, IceClassPolarCodeEnum, NatureEnum, ShipTypeEnum } from '@requests/common/types';
import { XmlResult, XmlValidationError } from '@shared/types';
import { XmlValidator } from '@shared/validators';

export class ShipParticularsDtoValidator {
  private static isShipImoNumberValid(value?: ShipParticularsDTO['shipImoNumber']): boolean {
    const shipImoNumberRegex = new RegExp('^\\d{7}$');
    return shipImoNumberRegex.test(value);
  }

  private static isShipUnique(existingImoNumbers: string[], value?: ShipParticularsDTO['shipImoNumber']): boolean {
    return !existingImoNumbers.includes(value?.toString());
  }

  private static isNameValid(value?: ShipParticularsDTO['name']): boolean {
    return XmlValidator.isRequired(value) && XmlValidator.isString(value) && XmlValidator.maxLength(value, 30);
  }

  private static isShipTypeValid(value?: ShipParticularsDTO['shipType']): boolean {
    return XmlValidator.isEnum(value, ShipTypeEnum);
  }

  private static isGrossTonnageValid(value?: ShipParticularsDTO['grossTonnage']): boolean {
    return XmlValidator.min(value, 5000) && XmlValidator.max(value, 999999999);
  }

  private static isFlagValid(value?: ShipParticularsDTO['flag']): boolean {
    return XmlValidator.isEnum(value, FlagEnum);
  }

  private static isIceClassPolarCodeValid(value?: ShipParticularsDTO['iceClassPolarCode']): boolean {
    return XmlValidator.isEnum(value, IceClassPolarCodeEnum);
  }

  private static isNatureValid(value?: NatureEnum): boolean {
    return XmlValidator.isEnum(value, NatureEnum);
  }

  /**
   * Validates whether the XML contains more than 1000 ShipParticularsDTO.
   * This should be explicitly called and displayed after all generic file validations are valid
   */
  public static validateMaxAllowedShips(shipParticulars: ShipParticularsDTO[]): XmlValidationError[] {
    if (shipParticulars?.length > 1000) {
      return [{ row: null, column: null, message: 'The maximum number of ships allowed is 1000' }];
    }

    return [];
  }

  /**
   * Validates each of ShipParticularsDTO[] for unique shipImoNumber, valid shipImoNumber and valid name.
   * This should be explicitly called and displayed after validateMaxAllowedShips is valid
   */
  public static validateCoreShipParticularsDTO(shipParticularsDTOs?: ShipParticularsDTO[]): XmlValidationError[] {
    const errors: XmlValidationError[] = [];
    const existingImoNumbers: string[] = [];

    shipParticularsDTOs?.forEach((shipParticularsDTO, index) => {
      const currentShipImoNumber = shipParticularsDTO?.shipImoNumber?.toString();
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

      if (!this.isNameValid(shipParticularsDTO?.name)) {
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
   * Validates and transforms from ShipParticularsDTO to ShipDetails
   * This should be explicitly called and displayed after validateCoreShipParticularsDTO is valid
   */
  public static validateShipParticularsDTO(shipParticular: ShipParticularsDTO): XmlResult<ShipDetails> {
    if (
      this.isShipTypeValid(shipParticular?.shipType) &&
      this.isGrossTonnageValid(shipParticular?.grossTonnage) &&
      this.isFlagValid(shipParticular?.flag) &&
      this.isIceClassPolarCodeValid(shipParticular?.iceClassPolarCode) &&
      this.isNatureValid(shipParticular?.company?.nature)
    ) {
      return {
        data: {
          imoNumber: shipParticular.shipImoNumber?.toString(),
          name: shipParticular.name,
          type: shipParticular.shipType,
          grossTonnage: shipParticular.grossTonnage,
          flagState: shipParticular.flag,
          iceClass: shipParticular.iceClassPolarCode,
          natureOfReportingResponsibility: shipParticular.company.nature,
        },
      };
    }

    return {
      errors: [
        {
          row: shipParticular.name,
          column: 'NO_FIELD',
          message:
            'There are errors in the basic ship details data you uploaded. Check the information entered and reupload the file',
        },
      ],
    };
  }
}

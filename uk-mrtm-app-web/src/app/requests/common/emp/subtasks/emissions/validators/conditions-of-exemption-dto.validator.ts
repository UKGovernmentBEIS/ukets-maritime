import { ExemptionConditions } from '@mrtm/api';

import { ConditionsOfExemptionDTO, ShipParticularsDTO } from '@requests/common/emp/subtasks/emissions/interfaces';
import { UseOfDerogationCodeEnum } from '@requests/common/types';
import { XmlResult } from '@shared/types';
import { XmlValidator } from '@shared/validators';

export class ConditionsOfExemptionDtoValidator {
  private static isUseOfDerogationCodeValid(conditionsOfExemptionDTO?: ConditionsOfExemptionDTO) {
    return XmlValidator.isEnum(conditionsOfExemptionDTO?.useOfDerogationCode, UseOfDerogationCodeEnum);
  }

  private static isMinimumNumberOfVoyagesValid(conditionsOfExemptionDTO?: ConditionsOfExemptionDTO) {
    return conditionsOfExemptionDTO?.useOfDerogationCode === 'YES'
      ? XmlValidator.min(conditionsOfExemptionDTO?.minimumNumberOfVoyages, 301)
      : XmlValidator.isEmpty(conditionsOfExemptionDTO?.minimumNumberOfVoyages);
  }

  private static isConditionsOfExemptionValid(conditionsOfExemption?: ConditionsOfExemptionDTO) {
    return (
      this.isUseOfDerogationCodeValid(conditionsOfExemption) &&
      this.isMinimumNumberOfVoyagesValid(conditionsOfExemption)
    );
  }

  /**
   * Transforms ConditionsOfExemptionDTO to ExemptionConditions
   * Assumes that conditionsOfExemption is valid at this point
   */
  private static transformConditionsOfExemptionDTO(
    conditionsOfExemption: ConditionsOfExemptionDTO,
  ): ExemptionConditions {
    return {
      exist: conditionsOfExemption?.useOfDerogationCode === UseOfDerogationCodeEnum.YES,
      minVoyages:
        conditionsOfExemption?.useOfDerogationCode === 'YES' ? conditionsOfExemption?.minimumNumberOfVoyages : null,
    };
  }

  /**
   * Validates ConditionsOfExemptionDTO and returns XmlResult<ExemptionConditions>
   * This should be explicitly called and displayed after validateCoreShipParticularsDTO is valid
   */
  public static validateConditionsOfExemptionDTO(shipParticular: ShipParticularsDTO): XmlResult<ExemptionConditions> {
    const conditionsOfExemptionDTO = shipParticular?.conditionsOfExemption;
    if (this.isConditionsOfExemptionValid(conditionsOfExemptionDTO)) {
      return {
        data: this.transformConditionsOfExemptionDTO(conditionsOfExemptionDTO),
      };
    }

    return {
      errors: [
        {
          row: shipParticular.name,
          column: 'NO_FIELD',
          message:
            'There are errors in the conditions of exemption from per voyage monitoring and reporting data you uploaded. Check the information entered and reupload the file',
        },
      ],
    };
  }
}

import { ExemptionConditions } from '@mrtm/api';

import { ConditionsOfExemptionDTO } from '@requests/common/emp/subtasks/emissions/interfaces';
import { UseOfDerogationCodeEnum } from '@requests/common/types';
import { XmlValidator } from '@shared/validators';

export class ConditionsOfExemptionDtoValidator {
  private static isUseOfDerogationCodeValid(value?: UseOfDerogationCodeEnum) {
    return XmlValidator.isEnum(value, UseOfDerogationCodeEnum);
  }

  private static isMinimumNumberOfVoyagesValid(value?: number) {
    return XmlValidator.min(value, 301);
  }

  private static transformUseOfDerogationCode(value?: UseOfDerogationCodeEnum): boolean {
    switch (value) {
      case UseOfDerogationCodeEnum.YES:
        return true;
      case UseOfDerogationCodeEnum.NO:
        return false;
      default:
        return null;
    }
  }

  /**
   * Validates and transforms ConditionsOfExemptionDTO to ExemptionConditions
   */
  public static transformConditionsOfExemptionDTO(
    conditionsOfExemption?: ConditionsOfExemptionDTO,
  ): Partial<ExemptionConditions> {
    const result: Partial<ExemptionConditions> = {};

    if (this.isUseOfDerogationCodeValid(conditionsOfExemption?.useOfDerogationCode)) {
      result.exist = this.transformUseOfDerogationCode(conditionsOfExemption.useOfDerogationCode);
    }

    if (this.isMinimumNumberOfVoyagesValid(conditionsOfExemption?.minimumNumberOfVoyages)) {
      result.minVoyages = conditionsOfExemption.minimumNumberOfVoyages;
    }

    return result;
  }
}

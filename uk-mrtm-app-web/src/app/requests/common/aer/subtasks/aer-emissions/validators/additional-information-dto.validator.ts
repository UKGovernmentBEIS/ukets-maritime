import { AerDerogations } from '@mrtm/api';

import { AdditionalInformationDTO } from '@requests/common/aer/subtasks/aer-emissions/interfaces';
import { XmlValidator } from '@shared/validators';

export class AdditionalInformationDtoValidator {
  private static isSmallIslandSurrenderReductionValid(
    value?: AdditionalInformationDTO['smallIslandSurrenderReduction'],
  ) {
    return XmlValidator.isBoolean(value);
  }

  private static isCarbonCaptureReductionValid(value?: AdditionalInformationDTO['carbonCaptureReduction']) {
    return XmlValidator.isBoolean(value);
  }

  private static isExemptionPerVoyageMonitoringValid(value?: AdditionalInformationDTO['exemptionPerVoyageMonitoring']) {
    return XmlValidator.isBoolean(value);
  }

  /**
   * Validates and transforms AdditionalInformationDTO to AerDerogations
   */
  public static transformAdditionalInformationDTOtoAerDerogations(
    additionalInformation: AdditionalInformationDTO,
  ): Partial<AerDerogations> {
    const result: Partial<AerDerogations> = {};

    if (this.isSmallIslandSurrenderReductionValid(additionalInformation?.smallIslandSurrenderReduction)) {
      result.smallIslandFerryOperatorReduction = additionalInformation.smallIslandSurrenderReduction;
    }

    if (this.isCarbonCaptureReductionValid(additionalInformation?.carbonCaptureReduction)) {
      result.carbonCaptureAndStorageReduction = additionalInformation.carbonCaptureReduction;
    }

    if (this.isExemptionPerVoyageMonitoringValid(additionalInformation?.exemptionPerVoyageMonitoring)) {
      result.exceptionFromPerVoyageMonitoring = additionalInformation.exemptionPerVoyageMonitoring;
    }

    return result;
  }
}

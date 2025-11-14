import { AerDerogations } from '@mrtm/api';

import {
  AdditionalInformationDTO,
  EmissionReportDetailsDTO,
} from '@requests/common/aer/subtasks/aer-emissions/interfaces';
import { XmlResult } from '@shared/types';
import { XmlValidator } from '@shared/validators';

export class AerAdditionalInformationDtoValidator {
  private static isExemptionPerVoyageMonitoringValid(
    value?: AdditionalInformationDTO['exemptionPerVoyageMonitoring'],
  ): boolean {
    return XmlValidator.isBoolean(value);
  }

  /**
   * Validates AdditionalInformationDTO and returns XmlResult<AerDerogations>
   * This should be explicitly called and displayed after validateCoreEmissionReportDetailsDTOs is valid
   */
  public static validateAdditionalInformationDTO(
    emissionReportDetails?: EmissionReportDetailsDTO,
  ): XmlResult<AerDerogations> {
    const additionalInformationDTO = emissionReportDetails?.additionalInformation;
    if (this.isExemptionPerVoyageMonitoringValid(additionalInformationDTO?.exemptionPerVoyageMonitoring)) {
      return {
        data: {
          exceptionFromPerVoyageMonitoring: additionalInformationDTO.exemptionPerVoyageMonitoring,
        },
      };
    }

    return {
      errors: [
        {
          row: emissionReportDetails.name,
          column: 'NO_FIELD',
          message:
            'There are errors in the additional questions relating to this ship data you uploaded. Check the information entered and reupload the file',
        },
      ],
    };
  }
}

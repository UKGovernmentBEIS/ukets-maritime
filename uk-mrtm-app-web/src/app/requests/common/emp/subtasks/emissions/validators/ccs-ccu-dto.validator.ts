import { EmpCarbonCapture, EmpEmissionsSources } from '@mrtm/api';

import { CcsCcuDTO, ShipParticularsDTO } from '@requests/common/emp/subtasks/emissions/interfaces';
import { CaptureAndStorageAppliedEnum } from '@requests/common/types';
import { XmlResult } from '@shared/types';
import { XmlValidator } from '@shared/validators';

export class CcsCcuDtoValidator {
  private static isCaptureAndStorageAppliedValid(ccsCcuDTO?: CcsCcuDTO) {
    return XmlValidator.isEnum(ccsCcuDTO?.captureAndStorageApplied, CaptureAndStorageAppliedEnum);
  }

  private static isDescriptionValid(ccsCcuDTO?: CcsCcuDTO) {
    return ccsCcuDTO?.captureAndStorageApplied === CaptureAndStorageAppliedEnum.YES
      ? XmlValidator.isRequired(ccsCcuDTO?.technology) &&
          XmlValidator.isString(ccsCcuDTO?.technology) &&
          XmlValidator.maxLength(ccsCcuDTO?.technology, 10000)
      : XmlValidator.isEmpty(ccsCcuDTO?.technology);
  }

  private static areEmissionSourceNamesValid(ccsCcuDTO?: CcsCcuDTO, empEmissionSources?: EmpEmissionsSources[]) {
    const uniqueIds = ccsCcuDTO?.emissionSourceName?.map((name) => name?.toUpperCase());
    const noDuplicatesValid = new Set(uniqueIds)?.size === uniqueIds?.length;
    const emissionSourcesNamesFound = empEmissionSources?.some((empEmissionSource) =>
      ccsCcuDTO?.emissionSourceName?.some(
        (emissionSourceName) => emissionSourceName?.toUpperCase() === empEmissionSource?.name?.toUpperCase(),
      ),
    );

    return ccsCcuDTO?.captureAndStorageApplied === CaptureAndStorageAppliedEnum.YES
      ? XmlValidator.minLength(ccsCcuDTO?.emissionSourceName, 1) && emissionSourcesNamesFound && noDuplicatesValid
      : XmlValidator.isEmpty(ccsCcuDTO?.emissionSourceName);
  }

  private static isCcsCcuDTOValid(ccsCcuDTO: CcsCcuDTO, emissionSources?: EmpEmissionsSources[]) {
    return (
      this.isCaptureAndStorageAppliedValid(ccsCcuDTO) &&
      this.isDescriptionValid(ccsCcuDTO) &&
      this.areEmissionSourceNamesValid(ccsCcuDTO, emissionSources)
    );
  }

  /**
   * Transform CcsCcuDTO['emissionSourceName'] to its mapped name in EmpEmissionsSources[]
   * and returns a string[] with these names
   * Assumes that ccsCcuDTO, empEmissionSources are valid at this point
   */
  private static transformCcsCcuDTOEmissionSourceNames(
    ccsCcuDTO: CcsCcuDTO,
    empEmissionSources: EmpEmissionsSources[],
  ): string[] {
    return ccsCcuDTO.emissionSourceName.map((name) => {
      const existingEmpEmissionSource = empEmissionSources.find(
        (emissionSource) => name.toUpperCase() === emissionSource?.name.toUpperCase(),
      );
      return existingEmpEmissionSource.name;
    });
  }

  /**
   * Transforms CcsCcuDTO to EmpCarbonCapture
   * Assumes that ccsCcuDTO is valid at this point
   */
  public static transformCcsCcuDTO(ccsCcuDTO: CcsCcuDTO, empEmissionSources: EmpEmissionsSources[]): EmpCarbonCapture {
    const empCarbonCapture: EmpCarbonCapture = {
      exist: ccsCcuDTO.captureAndStorageApplied === CaptureAndStorageAppliedEnum?.YES,
    };

    if (empCarbonCapture?.exist) {
      empCarbonCapture.technologies = {
        description: ccsCcuDTO?.technology,
        technologyEmissionSources: this.transformCcsCcuDTOEmissionSourceNames(ccsCcuDTO, empEmissionSources),
      };
    }

    return empCarbonCapture;
  }

  /**
   * Validates CcsCcuDTO and returns XmlResult<EmpCarbonCapture>
   * This should be explicitly called and displayed after validateCoreShipParticularsDTO is valid
   */
  public static validateCcsCcuDTO(
    shipParticular: ShipParticularsDTO,
    empEmissionsSources?: EmpEmissionsSources[],
  ): XmlResult<EmpCarbonCapture> {
    const ccsCcuDTO = shipParticular?.ccsCcu;

    if (this.isCcsCcuDTOValid(ccsCcuDTO, empEmissionsSources)) {
      return {
        data: this.transformCcsCcuDTO(ccsCcuDTO, empEmissionsSources),
      };
    }

    return {
      errors: [
        {
          row: shipParticular.name,
          column: 'NO_FIELD',
          message:
            'There are errors in the application of carbon capture and storage technologies data you uploaded. Check the information entered and reupload the file',
        },
      ],
    };
  }
}

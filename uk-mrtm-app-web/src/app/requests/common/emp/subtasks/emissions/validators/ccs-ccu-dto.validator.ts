import { EmpCarbonCapture, EmpEmissionsSources } from '@mrtm/api';

import { CcsCcuDTO } from '@requests/common/emp/subtasks/emissions/interfaces';
import { CaptureAndStorageAppliedEnum } from '@requests/common/types';
import { RecursivePartial } from '@shared/types';
import { XmlValidator } from '@shared/validators';

export class CcsCcuDtoValidator {
  private static isCaptureAndStorageAppliedValid(value?: CaptureAndStorageAppliedEnum) {
    return XmlValidator.isEnum(value, CaptureAndStorageAppliedEnum);
  }

  private static transformIsCaptureAndStorageApplied(value?: CaptureAndStorageAppliedEnum): boolean {
    switch (value) {
      case CaptureAndStorageAppliedEnum.YES:
        return true;
      case CaptureAndStorageAppliedEnum.NO:
        return false;
      default:
        return null;
    }
  }

  private static transformEmissionSourceNames(
    emissionSourceNames?: string[],
    empEmissionSources?: RecursivePartial<EmpEmissionsSources>[],
  ) {
    const technologyEmissionSources = [];

    if (emissionSourceNames?.length) {
      for (const source of emissionSourceNames) {
        if (empEmissionSources?.some((item) => item?.name === source)) {
          technologyEmissionSources.push(source);
        }
      }
    }

    return technologyEmissionSources;
  }

  /**
   * Validate and transform CcsCcuDTO to EmpCarbonCapture.
   * EmpCarbonCapture.technologyEmissionSources must be found in EmpEmissionsSources[i].name
   */
  public static transformCcsCcuDTO(
    ccsCcuDTO?: CcsCcuDTO,
    emissionSources?: RecursivePartial<EmpEmissionsSources>[],
  ): Partial<EmpCarbonCapture> {
    const empCarbonCapture: Partial<EmpCarbonCapture> = {};

    if (this.isCaptureAndStorageAppliedValid(ccsCcuDTO?.captureAndStorageApplied)) {
      empCarbonCapture.exist = this.transformIsCaptureAndStorageApplied(ccsCcuDTO.captureAndStorageApplied);
    }

    if (empCarbonCapture?.exist && (ccsCcuDTO?.technology || ccsCcuDTO?.emissionSourceName)) {
      empCarbonCapture.technologies = {
        description: ccsCcuDTO?.technology,
        technologyEmissionSources: this.transformEmissionSourceNames(ccsCcuDTO?.emissionSourceName, emissionSources),
      };
    }

    return empCarbonCapture;
  }
}

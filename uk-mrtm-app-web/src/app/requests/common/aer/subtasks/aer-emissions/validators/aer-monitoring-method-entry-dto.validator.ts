import { EmissionsSources, UncertaintyLevel } from '@mrtm/api';

import {
  EmissionReportDetailsDTO,
  MonitoringMethodEntryDTO,
} from '@requests/common/aer/subtasks/aer-emissions/interfaces';
import { LevelOfUncertaintyTypeCodeEnum, MonitoringMethodCodeEnum } from '@requests/common/types';
import { RecursivePartial, XmlResult } from '@shared/types';
import { XmlValidator } from '@shared/validators';

export class AerMonitoringMethodEntryDtoValidator {
  private static isMonitoringMethodCodeValid(monitoringMethodEntryDTO?: MonitoringMethodEntryDTO) {
    return XmlValidator.isEnum(monitoringMethodEntryDTO?.monitoringMethodCode, MonitoringMethodCodeEnum);
  }

  private static isLevelOfUncertaintyTypeCodeValid(monitoringMethodEntryDTO?: MonitoringMethodEntryDTO) {
    return XmlValidator.isEnum(monitoringMethodEntryDTO?.levelOfUncertaintyTypeCode, LevelOfUncertaintyTypeCodeEnum);
  }

  private static isShipSpecificUncertaintyValid(monitoringMethodEntryDTO?: MonitoringMethodEntryDTO) {
    const regex = new RegExp(`^(100?|(\\d{1,2})(\\.\\d{1,${2}})?)$`);
    return monitoringMethodEntryDTO?.levelOfUncertaintyTypeCode === LevelOfUncertaintyTypeCodeEnum.SHIP_SPECIFIC
      ? XmlValidator.gt(monitoringMethodEntryDTO?.shipSpecificUncertainty, 0) &&
          regex.test(monitoringMethodEntryDTO?.shipSpecificUncertainty?.toString())
      : XmlValidator.isEmpty(monitoringMethodEntryDTO?.shipSpecificUncertainty);
  }

  private static isMonitoringMethodFoundInEmissionSources(
    monitoringMethodCodeEnum?: MonitoringMethodCodeEnum,
    emissionSources?: RecursivePartial<EmissionsSources>[],
  ): boolean {
    return emissionSources?.some((source) => source?.monitoringMethod?.includes(monitoringMethodCodeEnum));
  }

  private static areMonitoringMethodEntryDTOsValid(
    monitoringMethodEntries?: MonitoringMethodEntryDTO[],
    emissionSources?: EmissionsSources[],
  ): boolean {
    const monitoringMethodsLengthValid =
      XmlValidator.minLength(monitoringMethodEntries, 1) && XmlValidator.maxLength(monitoringMethodEntries, 4);
    const allMonitoringMethodCodes = monitoringMethodEntries?.map(
      (monitoringMethod) => monitoringMethod?.monitoringMethodCode,
    );
    const noDuplicatesValid = new Set(allMonitoringMethodCodes).size === allMonitoringMethodCodes?.length;
    const allMonitoringMethodsValid = monitoringMethodEntries?.every(
      (monitoringMethodEntry) =>
        this.isMonitoringMethodFoundInEmissionSources(monitoringMethodEntry?.monitoringMethodCode, emissionSources) &&
        this.isMonitoringMethodCodeValid(monitoringMethodEntry) &&
        this.isLevelOfUncertaintyTypeCodeValid(monitoringMethodEntry) &&
        this.isShipSpecificUncertaintyValid(monitoringMethodEntry),
    );
    return monitoringMethodsLengthValid && noDuplicatesValid && allMonitoringMethodsValid;
  }

  /**
   * Transforms MonitoringMethodEntryDTO[] to UncertaintyLevel[]
   * Assumes monitoringMethodEntries are valid at this point
   */
  private static transformMonitoringMethodEntryDTOs(
    monitoringMethodEntries?: MonitoringMethodEntryDTO[],
  ): UncertaintyLevel[] {
    return monitoringMethodEntries?.map((monitoringMethodEntry) => ({
      monitoringMethod: monitoringMethodEntry.monitoringMethodCode,
      methodApproach: monitoringMethodEntry.levelOfUncertaintyTypeCode,
      value:
        monitoringMethodEntry.levelOfUncertaintyTypeCode === LevelOfUncertaintyTypeCodeEnum.DEFAULT
          ? '7.5'
          : monitoringMethodEntry.shipSpecificUncertainty.toString(),
    }));
  }

  /**
   * Validates MonitoringMethodEntryDTO[] and returns XmlResult<UncertaintyLevel[]>
   * This should be explicitly called and displayed after validateCoreShipParticularsDTO is valid
   */
  public static validateMonitoringMethodEntryDTOs(
    emissionReportDetails?: EmissionReportDetailsDTO,
    emissionSources?: EmissionsSources[],
  ): XmlResult<UncertaintyLevel[]> {
    const monitoringMethodDTOs = emissionReportDetails?.monitoringMethods?.monitoringMethodEntry;
    if (this.areMonitoringMethodEntryDTOsValid(monitoringMethodDTOs, emissionSources)) {
      return {
        data: this.transformMonitoringMethodEntryDTOs(monitoringMethodDTOs),
      };
    }

    return {
      errors: [
        {
          row: emissionReportDetails.name,
          column: 'NO_FIELD',
          message:
            'There are errors in the level of uncertainty associated with the fuel monitoring methods data you uploaded. Check the information entered and reupload the file',
        },
      ],
    };
  }
}

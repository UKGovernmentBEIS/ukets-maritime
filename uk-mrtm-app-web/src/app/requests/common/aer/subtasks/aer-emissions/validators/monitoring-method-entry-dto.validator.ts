import { EmissionsSources, UncertaintyLevel } from '@mrtm/api';

import { MonitoringMethodEntryDTO } from '@requests/common/aer/subtasks/aer-emissions/interfaces';
import { LevelOfUncertaintyTypeCodeEnum, MonitoringMethodCodeEnum } from '@requests/common/types';
import { RecursivePartial } from '@shared/types';
import { XmlValidator } from '@shared/validators';

export class MonitoringMethodEntryDtoValidator {
  private static isMonitoringMethodCodeValid(value?: MonitoringMethodCodeEnum) {
    return XmlValidator.isEnum(value, MonitoringMethodCodeEnum);
  }

  private static isLevelOfUncertaintyTypeCodeValid(value?: LevelOfUncertaintyTypeCodeEnum) {
    return XmlValidator.isEnum(value, LevelOfUncertaintyTypeCodeEnum);
  }

  private static isShipSpecificUncertaintyValid(value?: string) {
    const regex = new RegExp(`^-?(100?|(\\d{1,2})(\\.\\d{1,${2}})?)$`);
    return XmlValidator.gt(value, 0) && regex.test(value);
  }

  private static isMonitoringMethodFoundInEmissionSources(
    value?: MonitoringMethodCodeEnum,
    emissionSources?: RecursivePartial<EmissionsSources>[],
  ): boolean {
    return emissionSources?.some((source) => source?.monitoringMethod?.includes(value));
  }

  /**
   * Validates and transforms MonitoringMethodEntryDTO[] to UncertaintyLevel[]
   */
  public static transformMonitoringMethodEntryDTOs(
    monitoringMethodEntries?: MonitoringMethodEntryDTO[],
    emissionSources?: RecursivePartial<EmissionsSources>[],
  ): Partial<UncertaintyLevel>[] {
    const uncertaintyLevels: Partial<UncertaintyLevel>[] = [];
    const existingCodes: UncertaintyLevel['monitoringMethod'][] = [];

    if (monitoringMethodEntries?.length) {
      for (const monitoringMethodEntry of monitoringMethodEntries) {
        if (
          this.isMonitoringMethodFoundInEmissionSources(monitoringMethodEntry?.monitoringMethodCode, emissionSources)
        ) {
          const uncertaintyLevelItem: Partial<UncertaintyLevel> = {};

          if (this.isMonitoringMethodCodeValid(monitoringMethodEntry?.monitoringMethodCode)) {
            uncertaintyLevelItem.monitoringMethod = monitoringMethodEntry.monitoringMethodCode;
          }

          if (this.isLevelOfUncertaintyTypeCodeValid(monitoringMethodEntry?.levelOfUncertaintyTypeCode)) {
            uncertaintyLevelItem.methodApproach = monitoringMethodEntry.levelOfUncertaintyTypeCode;
          }

          if (monitoringMethodEntry.levelOfUncertaintyTypeCode === LevelOfUncertaintyTypeCodeEnum.DEFAULT) {
            uncertaintyLevelItem.value = '7.5';
          } else if (this.isShipSpecificUncertaintyValid(monitoringMethodEntry?.shipSpecificUncertainty)) {
            uncertaintyLevelItem.value = String(monitoringMethodEntry.shipSpecificUncertainty);
          }

          if (!existingCodes?.includes(uncertaintyLevelItem.monitoringMethod)) {
            existingCodes.push(uncertaintyLevelItem.monitoringMethod);
            uncertaintyLevels.push(uncertaintyLevelItem);
          }
        }
      }
    }

    return uncertaintyLevels;
  }
}

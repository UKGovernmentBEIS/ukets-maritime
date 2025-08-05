import { EmpEmissionsSources, MeasurementDescription } from '@mrtm/api';

import { MeasuringEquipmentEditDTO } from '@requests/common/emp/subtasks/emissions/interfaces';
import { RecursivePartial } from '@shared/types';

export class MeasuringEquipmentEditDtoValidator {
  private static transformEmissionSourceNames(
    emissionSourceNames?: string[],
    empEmissionSources?: RecursivePartial<EmpEmissionsSources>[],
  ) {
    const measurementSources = [];

    if (emissionSourceNames?.length) {
      for (const source of emissionSourceNames) {
        if (measurementSources.includes(source)) {
          break;
        }

        if (empEmissionSources?.some((item) => item?.name === source)) {
          measurementSources.push(source);
        }
      }
    }

    return measurementSources;
  }

  /**
   * Validate and transform MeasuringEquipmentEditDTO[] to MeasurementDescription[]
   * MeasurementDescription[i].emissionSources must be found in EmpEmissionsSources[i].name
   */
  public static transformMeasuringEquipmentEditDTOs(
    measuringEquipmentDtos?: MeasuringEquipmentEditDTO[],
    emissionSources?: RecursivePartial<EmpEmissionsSources>[],
  ): RecursivePartial<MeasurementDescription>[] {
    const empMeasurements: RecursivePartial<MeasurementDescription>[] = [];

    if (measuringEquipmentDtos?.length) {
      for (const measurement of measuringEquipmentDtos) {
        const empMeasurementItem: Partial<MeasurementDescription> = {};

        if (measurement?.name) {
          empMeasurementItem.name = measurement.name;
        }

        empMeasurementItem.emissionSources = this.transformEmissionSourceNames(
          measurement?.appliedToCode,
          emissionSources,
        );

        if (empMeasurementItem?.name || empMeasurementItem?.emissionSources?.length) {
          empMeasurements.push(empMeasurementItem);
        }
      }
    }

    return empMeasurements;
  }
}

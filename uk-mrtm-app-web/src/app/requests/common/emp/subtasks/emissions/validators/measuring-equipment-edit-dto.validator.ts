import { EmpEmissionsSources, MeasurementDescription } from '@mrtm/api';

import { MeasuringEquipmentEditDTO, ShipParticularsDTO } from '@requests/common/emp/subtasks/emissions/interfaces';
import { XmlResult } from '@shared/types';
import { XmlValidator } from '@shared/validators';

export class MeasuringEquipmentEditDtoValidator {
  private static isMeasuringEquipmentNameValid(measuringEquipmentEditDTO?: MeasuringEquipmentEditDTO): boolean {
    return (
      XmlValidator.isRequired(measuringEquipmentEditDTO?.name) &&
      XmlValidator.isString(measuringEquipmentEditDTO?.name) &&
      XmlValidator.maxLength(measuringEquipmentEditDTO?.name, 250)
    );
  }

  private static isMeasuringEquipmentAppliedToCodeValid(
    measuringEquipmentEditDTO?: MeasuringEquipmentEditDTO,
    empEmissionSources?: EmpEmissionsSources[],
  ): boolean {
    const uniqueIds = measuringEquipmentEditDTO?.appliedToCode?.map((name) => name?.toUpperCase());
    const noDuplicatesValid = new Set(uniqueIds)?.size === uniqueIds?.length;
    const appliedToCodeFound = empEmissionSources?.some((emissionSource) =>
      measuringEquipmentEditDTO?.appliedToCode?.some(
        (codeValue) => codeValue?.toUpperCase() === emissionSource?.name?.toUpperCase(),
      ),
    );

    return appliedToCodeFound && noDuplicatesValid;
  }

  private static areMeasuringEquipmentEditDTOsValid(
    measuringEquipmentDTOs?: MeasuringEquipmentEditDTO[],
    emissionSources?: EmpEmissionsSources[],
  ): boolean {
    const measuringEquipmentDTOsLengthValid = XmlValidator.minLength(measuringEquipmentDTOs, 1);
    const measuringEquipmentDTOsValid = measuringEquipmentDTOs?.every((measuringEquipmentDTO) => {
      return (
        this.isMeasuringEquipmentNameValid(measuringEquipmentDTO) &&
        this.isMeasuringEquipmentAppliedToCodeValid(measuringEquipmentDTO, emissionSources)
      );
    });

    return measuringEquipmentDTOsLengthValid && measuringEquipmentDTOsValid;
  }

  /**
   * Transform MeasuringEquipmentEditDTO['appliedToCode'] to its mapped name in EmpEmissionsSources[]
   * and returns a string[] with these names
   * Assumes that measuringEquipmentDTOs, empEmissionSources are valid at this point
   */
  private static transformMeasuringEquipmentAppliedToCodes(
    measuringEquipmentEditDTO: MeasuringEquipmentEditDTO,
    empEmissionSources: EmpEmissionsSources[],
  ): string[] {
    return measuringEquipmentEditDTO.appliedToCode.map((appliedToCode) => {
      const existingEmpEmissionSource = empEmissionSources.find(
        (emissionSource) => appliedToCode.toUpperCase() === emissionSource?.name.toUpperCase(),
      );
      return existingEmpEmissionSource.name;
    });
  }

  /**
   * Transform MeasuringEquipmentEditDTO[] to MeasurementDescription[]
   * Assumes that measuringEquipmentDTOs, empEmissionSources are valid at this point
   */
  private static transformMeasuringEquipmentEditDTOs(
    measuringEquipmentDTOs: MeasuringEquipmentEditDTO[],
    empEmissionSources: EmpEmissionsSources[],
  ): MeasurementDescription[] {
    return measuringEquipmentDTOs.map((measuringEquipmentDTO) => ({
      name: measuringEquipmentDTO.name,
      emissionSources: this.transformMeasuringEquipmentAppliedToCodes(measuringEquipmentDTO, empEmissionSources),
    }));
  }

  /**
   * Validates MonitoringMethodEntryDTO[] and returns XmlResult<MeasurementDescription[]>
   * This should be explicitly called and displayed after validateCoreShipParticularsDTO is valid
   */
  public static validateMeasuringEquipmentEditDTOs(
    shipParticular: ShipParticularsDTO,
    empEmissionSources?: EmpEmissionsSources[],
  ): XmlResult<MeasurementDescription[]> {
    const measuringEquipmentDTOs = shipParticular?.measuringEquipment?.measuringEquipmentEntry;
    if (this.areMeasuringEquipmentEditDTOsValid(measuringEquipmentDTOs, empEmissionSources)) {
      return {
        data: this.transformMeasuringEquipmentEditDTOs(measuringEquipmentDTOs, empEmissionSources),
      };
    }

    return {
      errors: [
        {
          row: shipParticular.name,
          column: 'NO_FIELD',
          message:
            'There are errors in the measurement instruments involved data you uploaded. Check the information entered and reupload the file',
        },
      ],
    };
  }
}

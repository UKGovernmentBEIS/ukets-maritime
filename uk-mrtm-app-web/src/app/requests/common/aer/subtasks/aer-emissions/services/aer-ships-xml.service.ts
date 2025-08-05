import { Injectable } from '@angular/core';

import { AerShipEmissions } from '@mrtm/api';

import { AerShipsXML, AerShipsXMLResultDto } from '@requests/common/aer/subtasks/aer-emissions/interfaces';
import {
  AerEmissionSourceEditDtoValidator,
  AerFuelTypeEmissionFactorEditDtoValidator,
  EmissionReportDetailsDtoValidator,
  MonitoringMethodEntryDtoValidator,
} from '@requests/common/aer/subtasks/aer-emissions/validators';
import { AdditionalInformationDtoValidator } from '@requests/common/aer/subtasks/aer-emissions/validators/additional-information-dto.validator';
import { ShipsXmlService } from '@requests/common/components/emissions/upload-ships';
import { RecursivePartial, XmlValidationError } from '@shared/types';
import { X2jOptions, XMLParser } from 'fast-xml-parser';

@Injectable({
  providedIn: 'root',
})
export class AerShipsXmlService implements ShipsXmlService {
  /**
   * Since there is no XSD schema validation, FastXMLParser declares objects to be always treated as array.
   */
  private readonly arrayDefinitions = [
    'emissionReportsList.emissionReport',
    'emissionReportsList.emissionReport.fuelTypes.fuelTypeEntry',
    'emissionReportsList.emissionReport.fuelTypes.fuelTypeEntry.emissionFactors',
    'emissionReportsList.emissionReport.emissionSources.emissionSourceEntry',
    'emissionReportsList.emissionReport.emissionSources.emissionSourceEntry.monitoringMethodCode',
    'emissionReportsList.emissionReport.emissionSources.emissionSourceEntry.fuelTypeCodes',
    'emissionReportsList.emissionReport.monitoringMethods.monitoringMethodEntry',
    'emissionReportsList.emissionReport.additionalInformation.additionalInformationEntry',
  ];

  private readonly options: X2jOptions = {
    ignoreAttributes: false,
    isArray: (_name, jpath) => this.arrayDefinitions.indexOf(jpath) !== -1,
  };

  /**
   * Parses an XML as text and returns AerShipsXMLResultDto which includes any validation errors and the actual data
   */
  parse(xmlText: string, reportingYear: string): AerShipsXMLResultDto {
    const shipsXML: AerShipsXML = new XMLParser(this.options).parse(xmlText) as AerShipsXML;
    return this.transformShipsXMLToShipEmissions(shipsXML, reportingYear);
  }

  /**
   * Validates ShipsXML and returns AerShipsXMLResultDto, containing both AerShipEmissions[] and XmlValidationError[]
   */
  private transformShipsXMLToShipEmissions(shipsXML: AerShipsXML, reportingYear: string): AerShipsXMLResultDto {
    const aerShipEmissions: AerShipEmissions[] = [];
    let errors: XmlValidationError[] = [];

    if (shipsXML?.emissionReportsList?.emissionReport?.length > 0) {
      const emissionReports = shipsXML.emissionReportsList.emissionReport;
      const maxAllowedShipsErrors = EmissionReportDetailsDtoValidator.maxAllowedShipsErrors(emissionReports);

      if (maxAllowedShipsErrors?.length) {
        errors = maxAllowedShipsErrors;
      } else {
        for (const [index, emissionReport] of emissionReports.entries()) {
          const emissionReportDetailsDTOPartiallyErrors =
            EmissionReportDetailsDtoValidator.shipParticularsDTOPartiallyErrors(
              index,
              aerShipEmissions,
              emissionReport,
            );
          if (emissionReportDetailsDTOPartiallyErrors?.length === 0) {
            const ship: RecursivePartial<AerShipEmissions> = {
              uniqueIdentifier: crypto.randomUUID(),
              details: EmissionReportDetailsDtoValidator.transformShipParticularDTO(emissionReport, reportingYear),
              fuelsAndEmissionsFactors:
                AerFuelTypeEmissionFactorEditDtoValidator.transformFuelTypeEmissionFactorEditDTO(
                  emissionReport?.fuelTypes?.fuelTypeEntry,
                ),
            };

            ship.emissionsSources = AerEmissionSourceEditDtoValidator.transformEmissionSourceEditDTOs(
              emissionReport?.emissionSources?.emissionSourceEntry,
              ship.fuelsAndEmissionsFactors,
            );

            ship.uncertaintyLevel = MonitoringMethodEntryDtoValidator.transformMonitoringMethodEntryDTOs(
              emissionReport?.monitoringMethods?.monitoringMethodEntry,
              ship.emissionsSources,
            );

            ship.derogations = AdditionalInformationDtoValidator.transformAdditionalInformationDTOtoAerDerogations(
              emissionReport?.additionalInformation,
            );

            aerShipEmissions.push(ship as AerShipEmissions);
          } else {
            errors.push(...emissionReportDetailsDTOPartiallyErrors);
          }
        }
      }
    }

    if (!aerShipEmissions?.length && !errors?.length) {
      errors.push({ row: null, column: null, message: 'The required fields are out of the expected criteria' });
    }

    return {
      data: aerShipEmissions,
      errors: errors,
    };
  }
}

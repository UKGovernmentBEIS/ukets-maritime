import { Injectable } from '@angular/core';

import { EmpShipEmissions } from '@mrtm/api';

import { ShipsXmlService } from '@requests/common/components/emissions/upload-ships';
import { EmpShipsXML, EmpShipsXMLResultDto } from '@requests/common/emp/subtasks/emissions/interfaces';
import {
  CcsCcuDtoValidator,
  ConditionsOfExemptionDtoValidator,
  EmpEmissionSourceEditDtoValidator,
  EmpFuelTypeEmissionFactorEditDtoValidator,
  MeasuringEquipmentEditDtoValidator,
  MonitoringMethodEntryDtoValidator,
  ShipParticularsDTOValidator,
} from '@requests/common/emp/subtasks/emissions/validators';
import { RecursivePartial, XmlValidationError } from '@shared/types';
import { X2jOptions, XMLParser } from 'fast-xml-parser';

@Injectable({
  providedIn: 'root',
})
export class EmpShipsXmlService implements ShipsXmlService {
  /**
   * Since there is no XSD schema validation, FastXMLParser declares objects to be always treated as an array.
   */
  private readonly arrayDefinitions = [
    'shipParticularsList.shipParticulars',
    'shipParticularsList.shipParticulars.ccsCcu.emissionSourceName',
    'shipParticularsList.shipParticulars.monitoringPlan.fuelTypes.fuelTypeEntry',
    'shipParticularsList.shipParticulars.monitoringPlan.fuelTypes.fuelTypeEntry.emissionFactors',
    'shipParticularsList.shipParticulars.monitoringPlan.emissionSources.emissionSourceEntry',
    'shipParticularsList.shipParticulars.monitoringPlan.emissionSources.emissionSourceEntry.monitoringMethodCode',
    'shipParticularsList.shipParticulars.monitoringPlan.emissionSources.emissionSourceEntry.fuelTypeCodes',
    'shipParticularsList.shipParticulars.monitoringPlan.monitoringMethods.monitoringMethodEntry',
    'shipParticularsList.shipParticulars.measuringEquipment.measuringEquipmentEntry',
    'shipParticularsList.shipParticulars.measuringEquipment.measuringEquipmentEntry.appliedToCode',
  ];

  private readonly options: X2jOptions = {
    ignoreAttributes: false,
    isArray: (_name, jpath) => this.arrayDefinitions.indexOf(jpath) !== -1,
  };

  /**
   * Parses an XML as text and returns EmpShipsXMLResultDto, which includes any validation errors and the actual data
   */
  parse(xmlText: string): EmpShipsXMLResultDto {
    const shipsXML: EmpShipsXML = new XMLParser(this.options).parse(xmlText) as EmpShipsXML;
    return this.transformShipsXMLToShipEmissions(shipsXML);
  }

  /**
   * Validates ShipsXML and returns EmpShipsXMLResultDto, containing both EmpShipEmission[] and XmlValidationError[]
   */
  private transformShipsXMLToShipEmissions(empShipsXML: EmpShipsXML): EmpShipsXMLResultDto {
    const empShipEmissions: EmpShipEmissions[] = [];
    let errors: XmlValidationError[] = [];

    if (empShipsXML?.shipParticularsList?.shipParticulars?.length > 0) {
      const shipParticulars = empShipsXML.shipParticularsList.shipParticulars;
      const maxAllowedShipsErrors = ShipParticularsDTOValidator.maxAllowedShipsErrors(shipParticulars);

      if (maxAllowedShipsErrors?.length) {
        errors = maxAllowedShipsErrors;
      } else {
        for (const [index, shipParticular] of shipParticulars.entries()) {
          const shipParticularsDTOPartiallyErrors = ShipParticularsDTOValidator.shipParticularsDTOPartiallyErrors(
            index,
            empShipEmissions,
            shipParticular,
          );
          if (shipParticularsDTOPartiallyErrors?.length === 0) {
            const ship: RecursivePartial<EmpShipEmissions> = {
              uniqueIdentifier: crypto.randomUUID(),
              details: ShipParticularsDTOValidator.transformShipParticularDTO(shipParticular),
              exemptionConditions: ConditionsOfExemptionDtoValidator.transformConditionsOfExemptionDTO(
                shipParticular?.conditionsOfExemption,
              ),
              fuelsAndEmissionsFactors:
                EmpFuelTypeEmissionFactorEditDtoValidator.transformFuelTypeEmissionFactorEditDTO(
                  shipParticular?.monitoringPlan?.fuelTypes?.fuelTypeEntry,
                ),
            };

            ship.emissionsSources = EmpEmissionSourceEditDtoValidator.transformEmissionSourceEditDTOs(
              shipParticular?.monitoringPlan?.emissionSources?.emissionSourceEntry,
              ship.fuelsAndEmissionsFactors,
            );

            ship.uncertaintyLevel = MonitoringMethodEntryDtoValidator.transformMonitoringMethodEntryDTOs(
              shipParticular?.monitoringPlan?.monitoringMethods?.monitoringMethodEntry,
              ship.emissionsSources,
            );

            ship.measurements = MeasuringEquipmentEditDtoValidator.transformMeasuringEquipmentEditDTOs(
              shipParticular?.measuringEquipment?.measuringEquipmentEntry,
              ship.emissionsSources,
            );

            ship.carbonCapture = CcsCcuDtoValidator.transformCcsCcuDTO(shipParticular?.ccsCcu, ship.emissionsSources);

            empShipEmissions.push(ship as EmpShipEmissions);
          } else {
            errors.push(...shipParticularsDTOPartiallyErrors);
          }
        }
      }
    }

    if (!empShipEmissions?.length && !errors?.length) {
      errors.push({ row: null, column: null, message: 'The required fields are out of the expected criteria' });
    }

    return {
      data: empShipEmissions,
      errors: errors,
    };
  }
}

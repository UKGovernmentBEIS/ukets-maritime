import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { FlattenedPort } from '@requests/common/aer/aer.types';

/**
 * Map that matches the headers of the CSV file and maps it to the appropriate property in the data model
 * Note: The string property must explicitly match the headers of the CSV file, when Papa.ParseLocalConfig has 'header: true'
 */
export const aerPortCsvMap: Record<keyof FlattenedPort, string> = {
  imoNumber: 'IMO Number',
  visitCountry: 'Country code of port',
  visitPort: 'Port code',
  arrivalDate: 'Date of arrival',
  arrivalActualTime: 'Actual time of arrival (ATA)',
  departureDate: 'Date of departure',
  departureActualTime: 'Actual time of departure (ATD)',
  ccs: 'Carbon capture and storage (CCS) (t)',
  ccu: 'Carbon capture and utilisation (CCU) (t)',
  smallIslandFerryReduction: 'Are you claiming a small island ferry operator surrender reduction?',
  fuelConsumptionOrigin: 'Fuel origin',
  fuelConsumptionType: 'Fuel type',
  fuelConsumptionOtherName: 'Other fuel (O)',
  fuelConsumptionEmissionSourceName: 'Unique emission source name (O)',
  fuelConsumptionMethaneSlip: 'Methane slip (O)',
  fuelConsumptionAmount: 'Amount',
  fuelConsumptionMeasuringUnit: 'Measuring unit',
  fuelConsumptionFuelDensity: 'Density (O)',
  directEmissionsCO2: 'CO2 emissions (t)',
  directEmissionsCH4: 'CH4 emissions (tCO2e)',
  directEmissionsN2O: 'N2O emissions (tCO2e)',
};

type AerPortCsvHeaders = (typeof aerPortCsvMap)[keyof typeof aerPortCsvMap];

type AerPortCsvRecord = {
  [K in AerPortCsvHeaders]: any;
};

export const aerPortsCSVMapper = (data: AerPortCsvRecord[]): FlattenedPort[] =>
  data.map((item: { [x: string]: any }) => ({
    imoNumber: item?.[aerPortCsvMap.imoNumber],
    visitCountry: item?.[aerPortCsvMap.visitCountry],
    visitPort: item?.[aerPortCsvMap.visitPort],
    departureDate: item?.[aerPortCsvMap.departureDate],
    departureActualTime: item?.[aerPortCsvMap.departureActualTime],
    arrivalDate: item?.[aerPortCsvMap.arrivalDate],
    arrivalActualTime: item?.[aerPortCsvMap.arrivalActualTime],
    ccs: item?.[aerPortCsvMap.ccs],
    ccu: item?.[aerPortCsvMap.ccu],
    smallIslandFerryReduction: item?.[aerPortCsvMap.smallIslandFerryReduction],
    fuelConsumptionOrigin: item?.[aerPortCsvMap.fuelConsumptionOrigin],
    fuelConsumptionType: item?.[aerPortCsvMap.fuelConsumptionType],
    fuelConsumptionOtherName: item?.[aerPortCsvMap.fuelConsumptionOtherName],
    fuelConsumptionEmissionSourceName: item?.[aerPortCsvMap.fuelConsumptionEmissionSourceName],
    fuelConsumptionMethaneSlip: item?.[aerPortCsvMap.fuelConsumptionMethaneSlip],
    fuelConsumptionAmount: item?.[aerPortCsvMap.fuelConsumptionAmount],
    fuelConsumptionMeasuringUnit: item?.[aerPortCsvMap.fuelConsumptionMeasuringUnit],
    fuelConsumptionFuelDensity: item?.[aerPortCsvMap.fuelConsumptionFuelDensity],
    directEmissionsCO2: item?.[aerPortCsvMap.directEmissionsCO2],
    directEmissionsCH4: item?.[aerPortCsvMap.directEmissionsCH4],
    directEmissionsN2O: item?.[aerPortCsvMap.directEmissionsN2O],
  }));

/**
 * Form based on FlattenedPort.
 * Since CSV cannot pass as object, we flatten it then transform it to PortDetails
 */
export type PortFormModel = Record<keyof FlattenedPort, FormControl>;

export type PortsFormArray = FormArray<FormGroup<PortFormModel>>;

export interface AerPortUploadCSVFormModel {
  ports: PortsFormArray;
  columns: FormControl<string[] | null>;
  file: FormControl<File | null>;
}

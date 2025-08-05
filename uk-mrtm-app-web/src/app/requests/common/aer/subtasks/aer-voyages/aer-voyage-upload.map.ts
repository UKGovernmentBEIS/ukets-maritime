import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { FlattenedVoyage } from '@requests/common/aer/aer.types';

/**
 * Map that matches the headers of the CSV file and maps it to the appropriate property in the data model
 * Note: The string property must explicitly match the headers of the CSV file, when Papa.ParseLocalConfig has 'header: true'
 */
export const aerVoyageCsvMap: Record<keyof FlattenedVoyage, string> = {
  imoNumber: 'IMO Number',
  departureCountry: 'Country code of departure',
  departurePort: 'Port code of departure',
  departureDate: 'Date of departure',
  departureActualTime: 'Actual time of departure (ATD)',
  arrivalCountry: 'Country code of arrival',
  arrivalPort: 'Port code of arrival',
  arrivalDate: 'Date of arrival',
  arrivalActualTime: 'Actual time of arrival (ATA)',
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

type AerVoyageCsvHeaders = (typeof aerVoyageCsvMap)[keyof typeof aerVoyageCsvMap];

type AerVoyageCsvRecord = {
  [K in AerVoyageCsvHeaders]: any;
};

export const aerVoyagesCSVMapper = (data: AerVoyageCsvRecord[]): FlattenedVoyage[] =>
  data.map((item: { [x: string]: any }) => ({
    imoNumber: item?.[aerVoyageCsvMap.imoNumber],
    departureCountry: item?.[aerVoyageCsvMap.departureCountry],
    departurePort: item?.[aerVoyageCsvMap.departurePort],
    departureDate: item?.[aerVoyageCsvMap.departureDate],
    departureActualTime: item?.[aerVoyageCsvMap.departureActualTime],
    arrivalCountry: item?.[aerVoyageCsvMap.arrivalCountry],
    arrivalPort: item?.[aerVoyageCsvMap.arrivalPort],
    arrivalDate: item?.[aerVoyageCsvMap.arrivalDate],
    arrivalActualTime: item?.[aerVoyageCsvMap.arrivalActualTime],
    ccs: item?.[aerVoyageCsvMap.ccs],
    ccu: item?.[aerVoyageCsvMap.ccu],
    smallIslandFerryReduction: item?.[aerVoyageCsvMap.smallIslandFerryReduction],
    fuelConsumptionOrigin: item?.[aerVoyageCsvMap.fuelConsumptionOrigin],
    fuelConsumptionType: item?.[aerVoyageCsvMap.fuelConsumptionType],
    fuelConsumptionOtherName: item?.[aerVoyageCsvMap.fuelConsumptionOtherName],
    fuelConsumptionEmissionSourceName: item?.[aerVoyageCsvMap.fuelConsumptionEmissionSourceName],
    fuelConsumptionMethaneSlip: item?.[aerVoyageCsvMap.fuelConsumptionMethaneSlip],
    fuelConsumptionAmount: item?.[aerVoyageCsvMap.fuelConsumptionAmount],
    fuelConsumptionMeasuringUnit: item?.[aerVoyageCsvMap.fuelConsumptionMeasuringUnit],
    fuelConsumptionFuelDensity: item?.[aerVoyageCsvMap.fuelConsumptionFuelDensity],
    directEmissionsCO2: item?.[aerVoyageCsvMap.directEmissionsCO2],
    directEmissionsCH4: item?.[aerVoyageCsvMap.directEmissionsCH4],
    directEmissionsN2O: item?.[aerVoyageCsvMap.directEmissionsN2O],
  }));

/**
 * Form based on FlattenedVoyage.
 * Since CSV cannot pass as object, we flatten it then transform it to VoyageDetails
 */
export type VoyageFormModel = Record<keyof FlattenedVoyage, FormControl>;

export type VoyagesFormArray = FormArray<FormGroup<VoyageFormModel>>;

export interface AerVoyageUploadCSVFormModel {
  voyages: VoyagesFormArray;
  columns: FormControl<string[] | null>;
  file: FormControl<File | null>;
}

import { Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { AerFuelConsumption, AerPortEmissionsMeasurement, AerPortVisit, FuelOriginTypeName } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { FlattenedPort } from '@requests/common/aer/aer.types';
import {
  aerPortCsvMap,
  AerPortUploadCSVFormModel,
  PortFormModel,
} from '@requests/common/aer/subtasks/aer-ports/aer-ports-upload.map';
import {
  csvFieldCountryValidator,
  csvFieldDateComparisonValidator,
  csvFieldDirectEmissionValidator,
  csvFieldDuplicateDirectEmissionsValidator,
  csvFieldFuelConsumptionValidator,
  csvFieldNoEmissionsValidator,
  csvFieldPortDateOverlapValidator,
  csvFieldPortValidator,
  csvFieldReportingYearValidator,
} from '@requests/common/aer/subtasks/csv-validators';
import { TASK_FORM } from '@requests/common/task-form.token';
import { AER_PORT_COUNTRIES, FileType } from '@shared/constants';
import { AllFuelOriginTypeName } from '@shared/types';
import {
  csvColumnDiffValidator,
  csvFieldArrayIncludesValidator,
  csvFieldDateValidator,
  csvFieldMaxDecimalsValidator,
  csvFieldPatternValidator,
  csvFieldRequiredValidator,
  csvFieldTimeValidator,
  csvRowsEmptyValidator,
  csvRowsLengthValidator,
  emptyFileValidator,
  fileExtensionValidator,
  fileNameLengthValidator,
  maxFileSizeValidator,
} from '@shared/validators';

export const aerPortsUploadFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [RequestTaskStore, FormBuilder],
  useFactory: (store: RequestTaskStore, fb: FormBuilder) => {
    return fb.group<AerPortUploadCSVFormModel>({
      ports: fb.array([] as FormGroup<PortFormModel>[], {
        updateOn: 'change',
        validators: uploadCSVFormValidators(store),
      }),
      columns: fb.control(null, {
        updateOn: 'change',
        validators: [csvColumnDiffValidator(aerPortCsvMap)],
      }),
      file: fb.control(null, {
        updateOn: 'change',
        validators: [
          fileExtensionValidator(['csv'], FileType.CSV, 'The selected file must be a CSV'),
          maxFileSizeValidator(20, 'The selected file must be smaller than 20MB'),
          fileNameLengthValidator(100, 'The selected file must must have a file name length less than 100 characters'),
          emptyFileValidator('The selected file cannot be empty'),
        ],
      }),
    });
  },
};

export const addPortFormGroup = (port: FlattenedPort): FormGroup<PortFormModel> => {
  return new FormGroup<PortFormModel>({
    imoNumber: new FormControl<string>(port?.imoNumber),
    visitCountry: new FormControl<AerPortVisit['country']>(port?.visitCountry),
    visitPort: new FormControl<AerPortVisit['port']>(port?.visitPort),
    arrivalDate: new FormControl<string>(port?.arrivalDate),
    arrivalActualTime: new FormControl<string>(port?.arrivalActualTime),
    departureDate: new FormControl<string>(port?.departureDate),
    departureActualTime: new FormControl<string>(port?.departureActualTime),
    ccs: new FormControl<string>(port?.ccs),
    ccu: new FormControl<string>(port?.ccu),
    smallIslandFerryReduction: new FormControl<boolean>(port?.smallIslandFerryReduction),
    fuelConsumptionOrigin: new FormControl<FuelOriginTypeName['origin']>(port?.fuelConsumptionOrigin),
    fuelConsumptionType: new FormControl<AllFuelOriginTypeName>(port?.fuelConsumptionType),
    fuelConsumptionOtherName: new FormControl<FuelOriginTypeName['name']>(port?.fuelConsumptionOtherName),
    fuelConsumptionEmissionSourceName: new FormControl<AerFuelConsumption['name']>(
      port?.fuelConsumptionEmissionSourceName,
    ),
    fuelConsumptionMethaneSlip: new FormControl<FuelOriginTypeName['methaneSlip']>(port?.fuelConsumptionMethaneSlip),
    fuelConsumptionAmount: new FormControl<AerFuelConsumption['amount']>(port?.fuelConsumptionAmount),
    fuelConsumptionMeasuringUnit: new FormControl<AerFuelConsumption['measuringUnit']>(
      port?.fuelConsumptionMeasuringUnit,
    ),
    fuelConsumptionFuelDensity: new FormControl<AerFuelConsumption['fuelDensity']>(port?.fuelConsumptionFuelDensity),
    directEmissionsCO2: new FormControl<AerPortEmissionsMeasurement['co2']>(port?.directEmissionsCO2),
    directEmissionsCH4: new FormControl<AerPortEmissionsMeasurement['ch4']>(port?.directEmissionsCH4),
    directEmissionsN2O: new FormControl<AerPortEmissionsMeasurement['n2o']>(port?.directEmissionsN2O),
  });
};

const uploadCSVFormValidators = (store: RequestTaskStore) => {
  const ships = store.select(aerCommonQuery.selectListOfShips)();
  const shipImoNumberKeys = ships.map((ship) => ship.imoNumber);
  const reportingYear = store.select(aerCommonQuery.selectReportingYear)();

  return [
    csvRowsEmptyValidator(),
    csvRowsLengthValidator(2000, 'The maximum number of ports allowed is 2000'),

    // imoNumber
    csvFieldRequiredValidator<FlattenedPort>(
      'imoNumber',
      aerPortCsvMap,
      `The field '${aerPortCsvMap.imoNumber}' is required`,
    ),
    csvFieldArrayIncludesValidator<FlattenedPort>(
      'imoNumber',
      aerPortCsvMap,
      shipImoNumberKeys,
      `The field '${aerPortCsvMap.imoNumber}' contains values that are inconsistent with the information provided in the Ship details`,
    ),
    csvFieldPatternValidator(
      'imoNumber',
      aerPortCsvMap,
      new RegExp(/^\d{7}$/),
      `The field '${aerPortCsvMap.imoNumber}' must be 7 digits`,
    ),

    // visitCountry
    csvFieldRequiredValidator<FlattenedPort>('visitCountry', aerPortCsvMap),
    csvFieldCountryValidator<FlattenedPort>(
      'visitCountry',
      aerPortCsvMap,
      Object.keys(AER_PORT_COUNTRIES).filter((key) => key === 'GB'),
    ),

    // visitPort
    csvFieldRequiredValidator<FlattenedPort>('visitPort', aerPortCsvMap),
    csvFieldPatternValidator(
      'visitPort',
      aerPortCsvMap,
      new RegExp(/^[A-Z]{5}$/),
      `The field '${aerPortCsvMap.visitPort}' is in an invalid format`,
    ),
    csvFieldPortValidator<FlattenedPort>('visitPort', aerPortCsvMap, 'visitCountry'),

    // arrivalDate
    csvFieldRequiredValidator<FlattenedPort>('arrivalDate', aerPortCsvMap),
    csvFieldDateValidator('arrivalDate', aerPortCsvMap),
    csvFieldDateComparisonValidator(
      'arrivalDate',
      'arrivalDate',
      'arrivalActualTime',
      'departureDate',
      'departureActualTime',
      aerPortCsvMap,
      `The field '${aerPortCsvMap.arrivalDate}' must be before the '${aerPortCsvMap.departureDate}'`,
    ),
    csvFieldReportingYearValidator('arrivalDate', aerPortCsvMap, reportingYear),

    // arrivalActualTime
    csvFieldRequiredValidator<FlattenedPort>('arrivalActualTime', aerPortCsvMap),
    csvFieldTimeValidator('arrivalActualTime', aerPortCsvMap),

    // departureDate
    csvFieldRequiredValidator<FlattenedPort>('departureDate', aerPortCsvMap),
    csvFieldDateValidator('departureDate', aerPortCsvMap),
    csvFieldDateComparisonValidator(
      'departureDate',
      'arrivalDate',
      'arrivalActualTime',
      'departureDate',
      'departureActualTime',
      aerPortCsvMap,
      `The field '${aerPortCsvMap.departureDate}' must be after the '${aerPortCsvMap.arrivalDate}'`,
    ),
    csvFieldReportingYearValidator('departureDate', aerPortCsvMap, reportingYear),

    // departureActualTime
    csvFieldRequiredValidator<FlattenedPort>('departureActualTime', aerPortCsvMap),
    csvFieldTimeValidator('departureActualTime', aerPortCsvMap),

    // Overlap of dates
    csvFieldPortDateOverlapValidator<FlattenedPort>('arrivalDate', 'departureDate', aerPortCsvMap, store),

    // ccs
    csvFieldRequiredValidator<FlattenedPort>('ccs', aerPortCsvMap),
    csvFieldMaxDecimalsValidator<FlattenedPort>('ccs', aerPortCsvMap, 2, true),

    // ccu
    csvFieldRequiredValidator<FlattenedPort>('ccu', aerPortCsvMap),
    csvFieldMaxDecimalsValidator<FlattenedPort>('ccu', aerPortCsvMap, 2, true),

    // smallIslandFerryReduction
    csvFieldRequiredValidator<FlattenedPort>('smallIslandFerryReduction', aerPortCsvMap),

    // fuelConsumptions / directEmissions
    csvFieldNoEmissionsValidator('The ship has not recorded any emissions for one or more ports'),

    // fuelConsumptions
    csvFieldFuelConsumptionValidator(store, 'ports'),

    // directEmissions
    csvFieldDirectEmissionValidator('The ship has recorded invalid or missing direct emissions for one or more ports'),
    csvFieldDuplicateDirectEmissionsValidator('ports'),
  ];
};

import { Provider } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { AerFuelConsumption, AerPortEmissionsMeasurement, AerPortVisit, FuelOriginTypeName } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { FlattenedVoyage } from '@requests/common/aer/aer.types';
import {
  aerVoyageCsvMap,
  AerVoyageUploadCSVFormModel,
  VoyageFormModel,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyage-upload.map';
import {
  csvFieldCountryValidator,
  csvFieldDateComparisonValidator,
  csvFieldDirectEmissionValidator,
  csvFieldDuplicateDirectEmissionsValidator,
  csvFieldFuelConsumptionValidator,
  csvFieldNoEmissionsValidator,
  csvFieldPortValidator,
  csvFieldReportingYearValidator,
  csvFieldVoyageDateOverlapValidator,
} from '@requests/common/aer/subtasks/csv-validators';
import { TASK_FORM } from '@requests/common/task-form.token';
import { AER_PORT_COUNTRIES, FileType } from '@shared/constants';
import { AllFuelOriginTypeName } from '@shared/types';
import {
  csvColumnDiffValidator,
  csvFieldArrayIncludesValidator,
  csvFieldDateValidator,
  csvFieldPatternValidator,
  csvFieldRequiredValidator,
  csvFieldTimeValidator,
  csvRowsEmptyValidator,
  csvRowsLengthValidator,
  emptyFileValidator,
  fileExtensionValidator,
  fileNameLengthValidator,
  fileRequiredValidator,
  maxFileSizeValidator,
} from '@shared/validators';

export const aerVoyageUploadFormProvider: Provider = {
  provide: TASK_FORM,
  deps: [FormBuilder],
  useFactory: (fb: FormBuilder) => {
    return fb.group<AerVoyageUploadCSVFormModel>({
      voyages: fb.array([] as FormGroup<VoyageFormModel>[]),
      columns: fb.control(null, {
        updateOn: 'change',
        validators: [csvColumnDiffValidator(aerVoyageCsvMap)],
      }),
      file: fb.control(null, {
        updateOn: 'change',
        validators: [
          fileExtensionValidator(['csv'], FileType.CSV, 'The selected file must be a CSV'),
          maxFileSizeValidator(20, 'The selected file must be smaller than 20MB'),
          fileNameLengthValidator(100, 'The selected file must have a file name length less than 100 characters'),
          emptyFileValidator('The selected file cannot be empty'),
          fileRequiredValidator('Upload the voyages and emission details file'),
        ],
      }),
    });
  },
};

export const addVoyageFormGroup = (voyage: FlattenedVoyage): FormGroup<VoyageFormModel> => {
  return new FormGroup<VoyageFormModel>({
    imoNumber: new FormControl<string>(voyage?.imoNumber),
    departureCountry: new FormControl<AerPortVisit['country']>(voyage?.departureCountry),
    departurePort: new FormControl<AerPortVisit['port']>(voyage?.departurePort),
    departureDate: new FormControl<string>(voyage?.departureDate),
    departureActualTime: new FormControl<string>(voyage?.departureActualTime),
    arrivalCountry: new FormControl<AerPortVisit['country']>(voyage?.arrivalCountry),
    arrivalPort: new FormControl<AerPortVisit['port']>(voyage?.arrivalPort),
    arrivalDate: new FormControl<string>(voyage?.arrivalDate),
    arrivalActualTime: new FormControl<string>(voyage?.arrivalActualTime),
    fuelConsumptionOrigin: new FormControl<FuelOriginTypeName['origin']>(voyage?.fuelConsumptionOrigin),
    fuelConsumptionType: new FormControl<AllFuelOriginTypeName>(voyage?.fuelConsumptionType),
    fuelConsumptionOtherName: new FormControl<FuelOriginTypeName['name']>(voyage?.fuelConsumptionOtherName),
    fuelConsumptionEmissionSourceName: new FormControl<AerFuelConsumption['name']>(
      voyage?.fuelConsumptionEmissionSourceName,
    ),
    fuelConsumptionMethaneSlip: new FormControl<FuelOriginTypeName['methaneSlip']>(voyage?.fuelConsumptionMethaneSlip),
    fuelConsumptionAmount: new FormControl<AerFuelConsumption['amount']>(voyage?.fuelConsumptionAmount),
    fuelConsumptionMeasuringUnit: new FormControl<AerFuelConsumption['measuringUnit']>(
      voyage?.fuelConsumptionMeasuringUnit,
    ),
    fuelConsumptionFuelDensity: new FormControl<AerFuelConsumption['fuelDensity']>(voyage?.fuelConsumptionFuelDensity),
    directEmissionsCO2: new FormControl<AerPortEmissionsMeasurement['co2']>(voyage?.directEmissionsCO2),
    directEmissionsCH4: new FormControl<AerPortEmissionsMeasurement['ch4']>(voyage?.directEmissionsCH4),
    directEmissionsN2O: new FormControl<AerPortEmissionsMeasurement['n2o']>(voyage?.directEmissionsN2O),
  });
};

export const uploadVoyageCSVFormValidators = (store: RequestTaskStore) => {
  const ships = store.select(aerCommonQuery.selectListOfShips)();
  const shipImoNumberKeys = ships.map((ship) => ship.imoNumber);
  const reportingYear = store.select(aerCommonQuery.selectReportingYear)();

  return [
    csvRowsEmptyValidator(),
    csvRowsLengthValidator(2000, 'The maximum number of voyages allowed is 2000'),

    // imoNumber
    csvFieldRequiredValidator<FlattenedVoyage>(
      'imoNumber',
      aerVoyageCsvMap,
      `The field '${aerVoyageCsvMap.imoNumber}' is required`,
    ),
    csvFieldArrayIncludesValidator<FlattenedVoyage>(
      'imoNumber',
      aerVoyageCsvMap,
      shipImoNumberKeys,
      `The field '${aerVoyageCsvMap.imoNumber}' contains values that are inconsistent with the information provided in the Ship details`,
    ),
    csvFieldPatternValidator(
      'imoNumber',
      aerVoyageCsvMap,
      new RegExp(/^\d{7}$/),
      `The field '${aerVoyageCsvMap.imoNumber}' must be 7 digits`,
    ),

    // departureCountry
    csvFieldRequiredValidator<FlattenedVoyage>('departureCountry', aerVoyageCsvMap),
    csvFieldCountryValidator<FlattenedVoyage>('departureCountry', aerVoyageCsvMap, Object.keys(AER_PORT_COUNTRIES)),

    // departurePort
    csvFieldRequiredValidator<FlattenedVoyage>('departurePort', aerVoyageCsvMap),
    csvFieldPatternValidator(
      'departurePort',
      aerVoyageCsvMap,
      new RegExp(/^([A-Z]{5}|NOT_APPLICABLE)$/),
      `The field '${aerVoyageCsvMap.departurePort}' is in an invalid format`,
    ),
    csvFieldPortValidator<FlattenedVoyage>('departurePort', aerVoyageCsvMap, 'departureCountry'),

    // departureDate
    csvFieldRequiredValidator<FlattenedVoyage>('departureDate', aerVoyageCsvMap),
    csvFieldDateValidator('departureDate', aerVoyageCsvMap),
    csvFieldDateComparisonValidator(
      'departureDate',
      'departureDate',
      'departureActualTime',
      'arrivalDate',
      'arrivalActualTime',
      aerVoyageCsvMap,
      `The field '${aerVoyageCsvMap.departureDate}' must be before the '${aerVoyageCsvMap.arrivalDate}'`,
    ),
    csvFieldReportingYearValidator('departureDate', aerVoyageCsvMap, reportingYear),

    // departureActualTime
    csvFieldRequiredValidator<FlattenedVoyage>('departureActualTime', aerVoyageCsvMap),
    csvFieldTimeValidator('departureActualTime', aerVoyageCsvMap),

    // arrivalCountry
    csvFieldRequiredValidator<FlattenedVoyage>('arrivalCountry', aerVoyageCsvMap),
    csvFieldCountryValidator<FlattenedVoyage>('arrivalCountry', aerVoyageCsvMap, Object.keys(AER_PORT_COUNTRIES)),

    // arrivalPort
    csvFieldRequiredValidator<FlattenedVoyage>('arrivalPort', aerVoyageCsvMap),
    csvFieldPatternValidator(
      'arrivalPort',
      aerVoyageCsvMap,
      new RegExp(/^([A-Z]{5}|NOT_APPLICABLE)$/),
      `The field '${aerVoyageCsvMap.arrivalPort}' is in an invalid format`,
    ),
    csvFieldPortValidator<FlattenedVoyage>('arrivalPort', aerVoyageCsvMap, 'arrivalCountry'),

    // arrivalDate
    csvFieldRequiredValidator<FlattenedVoyage>('arrivalDate', aerVoyageCsvMap),
    csvFieldDateValidator('arrivalDate', aerVoyageCsvMap),
    csvFieldDateComparisonValidator(
      'arrivalDate',
      'departureDate',
      'departureActualTime',
      'arrivalDate',
      'arrivalActualTime',
      aerVoyageCsvMap,
      `The field '${aerVoyageCsvMap.arrivalDate}' must be after the '${aerVoyageCsvMap.departureDate}'`,
    ),
    csvFieldReportingYearValidator('arrivalDate', aerVoyageCsvMap, reportingYear),

    // arrivalActualTime
    csvFieldRequiredValidator<FlattenedVoyage>('arrivalActualTime', aerVoyageCsvMap),
    csvFieldTimeValidator('arrivalActualTime', aerVoyageCsvMap),

    // Overlap of dates
    csvFieldVoyageDateOverlapValidator<FlattenedVoyage>('departureDate', 'arrivalDate', aerVoyageCsvMap, store),

    // fuelConsumptions / directEmissions
    csvFieldNoEmissionsValidator('The ship has not recorded any emissions for one or more voyages'),

    // fuelConsumptions
    csvFieldFuelConsumptionValidator(store, 'voyages'),

    // directEmissions
    csvFieldDirectEmissionValidator(
      'The ship has recorded invalid or missing direct emissions for one or more voyages',
    ),
    csvFieldDuplicateDirectEmissionsValidator('voyages'),
  ];
};

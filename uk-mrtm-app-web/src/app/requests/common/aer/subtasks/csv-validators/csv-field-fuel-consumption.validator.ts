import { FormControl, ValidatorFn } from '@angular/forms';

import { AerFuelConsumption, FuelOriginTypeName } from '@mrtm/api';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AllFuelOriginTypeName } from '@shared/types';

interface CsvFuelConsumption {
  origin: FuelOriginTypeName['origin'];
  type: AllFuelOriginTypeName;
  otherName: FuelOriginTypeName['name'];
  emissionSourceName: AerFuelConsumption['name'];
  methaneSlip: FuelOriginTypeName['methaneSlip'];
  amount: AerFuelConsumption['amount'];
  measuringUnit: AerFuelConsumption['measuringUnit'];
  fuelDensity: AerFuelConsumption['fuelDensity'];
}

/**
 * Validates when there is at least one field present in AerFuelConsumption or AerPortEmissionsMeasurement
 * that the whole object will be present
 * Returns the row the error was found at
 */
export function csvFieldFuelConsumptionValidator(store: RequestTaskStore, type: 'voyages' | 'ports'): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data)) {
      return null;
    }

    const errorMessageRows = [];

    data.forEach((dataRow, index) => {
      const imoNumber = dataRow?.['imoNumber'];
      const origin = dataRow?.['fuelConsumptionOrigin'];
      const type = dataRow?.['fuelConsumptionType'];
      const otherName = dataRow?.['fuelConsumptionOtherName'];
      const emissionSourceName = dataRow?.['fuelConsumptionEmissionSourceName'];
      const methaneSlip = dataRow?.['fuelConsumptionMethaneSlip'];
      const amount = dataRow?.['fuelConsumptionAmount'];
      const measuringUnit = dataRow?.['fuelConsumptionMeasuringUnit'];
      const fuelDensity = dataRow?.['fuelConsumptionFuelDensity'];

      const isConsumptionFieldPresent =
        origin || type || otherName || emissionSourceName || methaneSlip || amount || measuringUnit || fuelDensity;

      const cfc: CsvFuelConsumption = {
        origin,
        type,
        otherName,
        emissionSourceName,
        methaneSlip,
        amount,
        measuringUnit,
        fuelDensity,
      };

      if (isConsumptionFieldPresent && !isValidFuelConsumption(imoNumber, cfc, store)) {
        errorMessageRows.push({
          rowIndex: index + 1,
        });
      }
    });

    if (errorMessageRows.length > 0) {
      return {
        ['csvFieldFuelConsumption']: {
          rows: errorMessageRows,
          columns: null,
          message: `The ship has recorded invalid or missing fuel consumption for one or more ${type}`,
        },
      };
    }

    return null;
  };
}

const isValidFuelConsumption = (imoNumber: string, cfc: CsvFuelConsumption, store: RequestTaskStore) => {
  const type = cfc.type as unknown as AllFuelOriginTypeName['type'];
  const isFuelCombinationValid = store.select(
    aerCommonQuery.selectShipFuelOriginMethaneCombination(
      imoNumber,
      cfc.origin,
      type,
      cfc.emissionSourceName,
      cfc.methaneSlip,
    ),
  )();

  const isAmountValid = maxDecimals(cfc.amount, 5);

  const isMeasuringUnitValid = ['M3', 'TONNES'].includes(cfc.measuringUnit);

  const isAmountDensityValid =
    maxDecimals(cfc.fuelDensity, 3) && Number(cfc?.fuelDensity) > 0 && Number(cfc?.fuelDensity) <= 1;
  const isDensityValid =
    (cfc.measuringUnit === 'M3' && isAmountDensityValid) || (cfc.measuringUnit !== 'M3' && !cfc.fuelDensity);

  return isFuelCombinationValid && isAmountValid && isMeasuringUnitValid && isDensityValid;
};

const maxDecimals = (value: any, decimalDigits: number, isPositiveOnly = true) => {
  const pattern = new RegExp(`^${isPositiveOnly ? '' : '-?'}[0-9]+(\\.[0-9]{1,${decimalDigits}})?$`);
  return pattern.test(value);
};

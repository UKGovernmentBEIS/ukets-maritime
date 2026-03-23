import { GovukTableColumn } from '@netz/govuk-components';

import { FuelConsumptionItemDto } from '@shared/components/summaries/ports-and-voyages/fuel-consumption-and-direct-emissions-summary-template/fuel-consumption-and-direct-emissions-summary-template.types';

export const FUEL_CONSUMPTIONS_SUMMARY_COLUMNS: Array<GovukTableColumn<FuelConsumptionItemDto>> = [
  { field: 'fuelOriginTypeName', header: 'Fuel type', widthClass: 'app-column-width-20-per' },
  { field: 'name', header: 'Unique emission source name' },
  { field: 'methaneSlip', header: 'Methane slip (%)' },
  { field: 'amount', header: 'Amount' },
  { field: 'measuringUnit', header: 'Measuring unit' },
  { field: 'fuelDensity', header: 'Density' },
  { field: 'totalConsumption', header: 'Consumption (tonnes)' },
  { field: null, header: null },
];

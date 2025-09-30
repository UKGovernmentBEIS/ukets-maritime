import { FormControl, FormGroup } from '@angular/forms';

import { AutocompleteSelectOption } from '@shared/components/autocomplete-select';

export interface FilterByShipAndDateRange {
  imoNumber: string;
  shipName: string;
  arrivalDate: Date | null;
  departureDate: Date | null;
}

export type FilterByShipAndDateRangeFormGroup = FormGroup<{
  filterByShip: FormControl<AutocompleteSelectOption>;
  dates: FilterByShipAndDateRangeDatesFormGroup;
}>;

export type FilterByShipAndDateRangeDatesFormGroup = FormGroup<{
  arrivalDate: FormControl<Date>;
  departureDate: FormControl<Date>;
}>;

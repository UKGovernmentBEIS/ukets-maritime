import { FormControl } from '@angular/forms';

import { EmpVariationDetails } from '@mrtm/api';

export type EmpVariationDetailsUserInput = Omit<EmpVariationDetails, 'changes'> & {
  significantChanges: Array<
    | 'ADD_NEW_SHIP'
    | 'ADD_NEW_FUELS_OR_EMISSION_SOURCES'
    | 'CHANGE_MONITORING_METHOD'
    | 'CHANGE_EMISSION_FACTOR_VALUES'
    | 'CHANGE_COMPANY_NAME_OR_REGISTERED_ADDRESS'
    | 'USE_OF_EXEMPTION'
    | 'USE_OF_CARBON'
    | 'OTHER_SIGNIFICANT'
  >;
  nonSignificantChanges: Array<'REMOVING_SHIP' | 'UPDATE_PROCEDURES' | 'OTHER_NON_SIGNIFICANT'>;
};

export type EmpVariationDetailsFormModel = Record<keyof EmpVariationDetailsUserInput, FormControl>;

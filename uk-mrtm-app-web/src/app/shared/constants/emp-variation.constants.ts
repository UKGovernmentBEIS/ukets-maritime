import { GovukSelectOption } from '@netz/govuk-components';

export const EMP_VARIATION_SIGNIFICANT_CHANGES_SELECT_OPTIONS: GovukSelectOption<string>[] = [
  {
    value: 'ADD_NEW_SHIP',
    text: 'Adding a new Ship',
  },
  {
    value: 'ADD_NEW_FUELS_OR_EMISSION_SOURCES',
    text: 'Addition of new fuels or emissions sources, including sustainable fuels',
  },
  {
    value: 'CHANGE_MONITORING_METHOD',
    text: 'Changing monitoring method',
  },
  {
    value: 'CHANGE_EMISSION_FACTOR_VALUES',
    text: 'Changing the emission factor values',
  },
  {
    value: 'CHANGE_EMP_HOLDER_NAME_OR_ADDRESS',
    text: 'Changing the EMP holder name or address',
  },
  {
    value: 'USE_OF_EXEMPTION',
    text: 'Use of the exemption from per voyage monitoring and reporting',
  },
  {
    value: 'USE_OF_CARBON',
    text: 'Use of Carbon Capture and Storage',
  },
  {
    value: 'UPDATE_DELEGATED_RESPONSIBILITY',
    text: 'Updating the Delegated responsibility details',
  },
  {
    value: 'OTHER_SIGNIFICANT',
    text: 'Other',
  },
];
export const EMP_VARIATION_NON_SIGNIFICANT_CHANGES_SELECT_OPTIONS: GovukSelectOption<string>[] = [
  {
    value: 'REMOVING_SHIP',
    text: 'Removing a ship',
  },
  {
    value: 'UPDATE_PROCEDURES',
    text: 'Updates to procedures',
  },
  {
    value: 'OTHER_NON_SIGNIFICANT',
    text: 'Other',
  },
];

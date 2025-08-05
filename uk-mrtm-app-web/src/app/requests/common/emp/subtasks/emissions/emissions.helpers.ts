import { BASIC_SHIP_DETAILS_STEP } from '@requests/common/components/emissions/basic-ship-details';
import { LIST_OF_SHIPS_DELETE_STEP } from '@requests/common/components/emissions/delete-ships/delete-ships.helper';
import { EMISSION_SOURCES_AND_FUEL_TYPES_USED_FORM_STEP } from '@requests/common/components/emissions/emission-sources-and-fuel-types-used-form/emission-sources-and-fuel-types-used-form.helper';
import { LIST_OF_SHIPS_STEP, UPLOAD_SHIPS_STEP } from '@requests/common/components/emissions/emissions.helpers';
import { FUELS_AND_EMISSIONS_FORM_STEP } from '@requests/common/components/emissions/fuels-and-emissions-factors-form/fuels-and-emissions-factors-form.helper';
import { UNCERTAINTY_LEVEL_STEP } from '@requests/common/components/emissions/uncertainty-level';

export enum EmissionsWizardStep {
  BASIC_DETAILS = BASIC_SHIP_DETAILS_STEP,
  FUELS_AND_EMISSIONS_LIST = FUELS_AND_EMISSIONS_FORM_STEP + '/list',
  FUELS_AND_EMISSIONS_FORM = FUELS_AND_EMISSIONS_FORM_STEP,
  EMISSION_SOURCES_LIST = EMISSION_SOURCES_AND_FUEL_TYPES_USED_FORM_STEP + '/list',
  EMISSION_SOURCES_FORM = EMISSION_SOURCES_AND_FUEL_TYPES_USED_FORM_STEP,
  UNCERTAINTY_LEVEL = UNCERTAINTY_LEVEL_STEP,
  MEASUREMENTS = 'measurement-instruments',
  CARBON_CAPTURE = 'carbon-capture',
  EXEMPTION_CONDITIONS = 'conditions-of-exemption',
  LIST_OF_SHIPS = LIST_OF_SHIPS_STEP,
  SHIP_SUMMARY = '../../',
  DELETE_SHIPS = LIST_OF_SHIPS_DELETE_STEP,
  VARIATION_REGULATOR_DECISION = 'variation-regulator-decision',
  DECISION = 'decision',
  UPLOAD_SHIPS = UPLOAD_SHIPS_STEP,
  SUMMARY = '../',
}

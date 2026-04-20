import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { CONTROL_ACTIVITIES_SUB_TASK } from '@requests/common/emp/subtasks/control-activities';
import { DATA_GAPS_SUB_TASK } from '@requests/common/emp/subtasks/data-gaps';
import { EMISSION_SOURCES_SUB_TASK } from '@requests/common/emp/subtasks/emission-sources';
import { GREENHOUSE_GAS_SUB_TASK } from '@requests/common/emp/subtasks/greenhouse-gas';
import { MANAGEMENT_PROCEDURES_SUB_TASK } from '@requests/common/emp/subtasks/management-procedures';
import { MANDATE_SUB_TASK } from '@requests/common/emp/subtasks/mandate';

export const IMPORT_THIRD_PARTY_DATA_PROVIDER_ROUTE_PATH = 'import-third-party-data-provider';

export const IMPORT_THIRD_PARTY_DATA_PROVIDER_SUB_TASK = 'importThirdPartyDataProvider';

export const SUBTASKS_AFFECTED_BY_IMPORT = [
  EMISSIONS_SUB_TASK,
  EMISSION_SOURCES_SUB_TASK,
  GREENHOUSE_GAS_SUB_TASK,
  DATA_GAPS_SUB_TASK,
  MANDATE_SUB_TASK,
  MANAGEMENT_PROCEDURES_SUB_TASK,
  CONTROL_ACTIVITIES_SUB_TASK,
] as const;

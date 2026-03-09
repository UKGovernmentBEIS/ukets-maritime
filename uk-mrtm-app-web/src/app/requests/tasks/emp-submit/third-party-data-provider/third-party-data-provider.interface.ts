import { EmissionsMonitoringPlan, ThirdPartyDataProviderDTO } from '@mrtm/api';

import { SUBTASKS_AFFECTED_BY_IMPORT } from '@requests/tasks/emp-submit/third-party-data-provider/third-party-data-provider.const';

type SubtasksAffectedByImport = (typeof SUBTASKS_AFFECTED_BY_IMPORT)[number];

export type ThirdPartyDataProviderPayload = Pick<EmissionsMonitoringPlan, SubtasksAffectedByImport>;

export interface ThirdPartyDataProviderDTOExtended extends ThirdPartyDataProviderDTO {
  payload?: ThirdPartyDataProviderPayload;
}

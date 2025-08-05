import { inject } from '@angular/core';

import { RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import {
  aerAdditionalDocumentsMap,
  aerPortsMap,
  aerTotalEmissionsMap,
  monitoringPlanChangesMap,
  reportingObligationMap,
} from '@requests/common/aer';
import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  AER_AGGREGATED_DATA_SUB_TASK,
  aerAggregatedDataSubtasksListMap,
} from '@requests/common/aer/subtasks/aer-aggregated-data';
import { AER_PORTS_SUB_TASK } from '@requests/common/aer/subtasks/aer-ports';
import { AER_TOTAL_EMISSIONS_SUB_TASK } from '@requests/common/aer/subtasks/aer-total-emissions';
import { AER_VOYAGES_SUB_TASK, aerVoyagesMap } from '@requests/common/aer/subtasks/aer-voyages';
import { MONITORING_PLAN_CHANGES_SUB_TASK } from '@requests/common/aer/subtasks/monitoring-plan-changes/monitoring-plan-changes.helpers';
import { AER_REDUCTION_CLAIM_SUB_TASK, reductionClaimMap } from '@requests/common/aer/subtasks/reduction-claim';
import { REPORTING_OBLIGATION_SUB_TASK } from '@requests/common/aer/subtasks/reporting-obligation/reporting-obligation.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { OPERATOR_DETAILS_SUB_TASK, operatorDetailsMap } from '@requests/common/components/operator-details';
import { emissionsSubTasksMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { ADDITIONAL_DOCUMENTS_SUB_TASK } from '@requests/common/utils/additional-documents';
import { aerAmendQuery } from '@requests/tasks/aer-amend/+state';
import { REQUESTED_CHANGES_SUB_TASK } from '@requests/tasks/aer-amend/subtasks/requested-changes';

export const AER_SUBTASK_TITLES_MAP = {
  [REPORTING_OBLIGATION_SUB_TASK]: reportingObligationMap.title,
  [OPERATOR_DETAILS_SUB_TASK]: operatorDetailsMap.title,
  [MONITORING_PLAN_CHANGES_SUB_TASK]: monitoringPlanChangesMap.title,
  [EMISSIONS_SUB_TASK]: emissionsSubTasksMap.title,
  [AER_VOYAGES_SUB_TASK]: aerVoyagesMap.caption,
  [AER_PORTS_SUB_TASK]: aerPortsMap.caption,
  [AER_AGGREGATED_DATA_SUB_TASK]: aerAggregatedDataSubtasksListMap.caption,
  [AER_REDUCTION_CLAIM_SUB_TASK]: reductionClaimMap.title,
  [ADDITIONAL_DOCUMENTS_SUB_TASK]: aerAdditionalDocumentsMap.title,
  [AER_TOTAL_EMISSIONS_SUB_TASK]: aerTotalEmissionsMap.title,
};

export function getCanSubmitAmendAer(): boolean {
  const store = inject(RequestTaskStore);
  const requestedChangesStatus = store.select(aerAmendQuery.selectStatusForSubtask(REQUESTED_CHANGES_SUB_TASK))();

  return (
    requestedChangesStatus === TaskItemStatus.COMPLETED &&
    Object.keys(AER_SUBTASK_TITLES_MAP)
      .map((key) => store.select(aerCommonQuery.selectStatusForAerSubtask(key))())
      .every((status) => status === TaskItemStatus.COMPLETED)
  );
}

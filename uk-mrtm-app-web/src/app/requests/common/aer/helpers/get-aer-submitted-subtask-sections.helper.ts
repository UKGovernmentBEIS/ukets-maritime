import { Aer } from '@mrtm/api';

import { TaskSection } from '@netz/common/model';

import { selectStatusForSubtask } from '@requests/common/aer/helpers/common.helpers';
import { aerAdditionalDocumentsMap } from '@requests/common/aer/subtasks/aer-additional-documents';
import {
  AER_AGGREGATED_DATA_SUB_TASK,
  AER_AGGREGATED_DATA_SUB_TASK_PATH,
  aerAggregatedDataSubtasksListMap,
} from '@requests/common/aer/subtasks/aer-aggregated-data';
import { AER_PORTS_SUB_TASK, aerPortsMap } from '@requests/common/aer/subtasks/aer-ports';
import {
  aerEmissionsMap,
  aerTotalEmissionsMap,
  monitoringPlanChangesMap,
} from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import {
  AER_TOTAL_EMISSIONS_SUB_TASK,
  AER_TOTAL_EMISSIONS_SUB_TASK_PATH,
} from '@requests/common/aer/subtasks/aer-total-emissions';
import { AER_VOYAGES_SUB_TASK, aerVoyagesMap } from '@requests/common/aer/subtasks/aer-voyages';
import {
  MONITORING_PLAN_CHANGES_SUB_TASK,
  MONITORING_PLAN_CHANGES_SUB_TASK_PATH,
} from '@requests/common/aer/subtasks/monitoring-plan-changes';
import { AER_REDUCTION_CLAIM_SUB_TASK, reductionClaimMap } from '@requests/common/aer/subtasks/reduction-claim';
import { EMISSIONS_SUB_TASK, EMISSIONS_SUB_TASK_PATH } from '@requests/common/components/emissions/emissions.helpers';
import {
  OPERATOR_DETAILS_SUB_TASK,
  OPERATOR_DETAILS_SUB_TASK_PATH,
  operatorDetailsMap,
} from '@requests/common/components/operator-details';
import { TaskItemStatus } from '@requests/common/task-item-status';
import {
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  ADDITIONAL_DOCUMENTS_SUB_TASK_PATH,
} from '@requests/common/utils/additional-documents';

export const getAerSubmittedSubtaskSections = (
  routePrefix: string,
  aer: Aer,
  showStatus: boolean = false,
  sectionsCompleted: { [key: string]: string } = {},
  defaultStatus: TaskItemStatus = TaskItemStatus.COMPLETED,
): TaskSection[] => {
  const hasPorts = !!aer?.portEmissions?.ports?.length;
  const hasVoyages = !!aer?.voyageEmissions?.voyages?.length;

  return [
    {
      title: operatorDetailsMap.title,
      tasks: [
        {
          name: OPERATOR_DETAILS_SUB_TASK,
          status: showStatus ? selectStatusForSubtask(OPERATOR_DETAILS_SUB_TASK, sectionsCompleted, defaultStatus) : '',
          linkText: operatorDetailsMap.title,
          link: `${routePrefix}/${OPERATOR_DETAILS_SUB_TASK_PATH}`,
        },
      ],
    },
    {
      title: 'Emissions overview',
      tasks: [
        {
          name: MONITORING_PLAN_CHANGES_SUB_TASK,
          status: showStatus
            ? selectStatusForSubtask(MONITORING_PLAN_CHANGES_SUB_TASK, sectionsCompleted, defaultStatus)
            : '',
          linkText: monitoringPlanChangesMap.title,
          link: `${routePrefix}/${MONITORING_PLAN_CHANGES_SUB_TASK_PATH}`,
        },
        {
          name: EMISSIONS_SUB_TASK,
          status: showStatus ? selectStatusForSubtask(EMISSIONS_SUB_TASK, sectionsCompleted, defaultStatus) : '',
          linkText: aerEmissionsMap.title,
          link: `${routePrefix}/${EMISSIONS_SUB_TASK_PATH}`,
        },
        {
          name: AER_VOYAGES_SUB_TASK,
          status: showStatus
            ? hasVoyages
              ? selectStatusForSubtask(AER_VOYAGES_SUB_TASK, sectionsCompleted, defaultStatus)
              : TaskItemStatus.OPTIONAL
            : '',
          linkText: aerVoyagesMap.caption,
          link: hasVoyages ? `${routePrefix}/${AER_VOYAGES_SUB_TASK}` : null,
          hint: hasVoyages ? undefined : `No voyages added by the user`,
        },
        {
          name: AER_PORTS_SUB_TASK,
          status: showStatus
            ? hasPorts
              ? selectStatusForSubtask(AER_PORTS_SUB_TASK, sectionsCompleted, defaultStatus)
              : TaskItemStatus.OPTIONAL
            : '',
          linkText: aerPortsMap.caption,
          link: hasPorts ? `${routePrefix}/${AER_PORTS_SUB_TASK}` : null,
          hint: hasPorts ? undefined : `No ports added by the user`,
        },
        {
          name: AER_AGGREGATED_DATA_SUB_TASK,
          status: showStatus
            ? selectStatusForSubtask(AER_AGGREGATED_DATA_SUB_TASK, sectionsCompleted, defaultStatus)
            : '',
          linkText: aerAggregatedDataSubtasksListMap.caption,
          link: `${routePrefix}/${AER_AGGREGATED_DATA_SUB_TASK_PATH}`,
        },
        {
          name: AER_REDUCTION_CLAIM_SUB_TASK,
          status: showStatus
            ? selectStatusForSubtask(AER_REDUCTION_CLAIM_SUB_TASK, sectionsCompleted, defaultStatus)
            : '',
          linkText: reductionClaimMap.title,
          link: `${routePrefix}/${AER_REDUCTION_CLAIM_SUB_TASK}`,
        },
      ],
    },
    {
      title: 'Additional information',
      tasks: [
        {
          name: ADDITIONAL_DOCUMENTS_SUB_TASK,
          status: showStatus
            ? selectStatusForSubtask(ADDITIONAL_DOCUMENTS_SUB_TASK, sectionsCompleted, defaultStatus)
            : '',
          linkText: aerAdditionalDocumentsMap.title,
          link: `${routePrefix}/${ADDITIONAL_DOCUMENTS_SUB_TASK_PATH}`,
        },
      ],
    },
    {
      title: 'Total emissions',
      tasks: [
        {
          name: AER_TOTAL_EMISSIONS_SUB_TASK,
          status: showStatus
            ? selectStatusForSubtask(AER_TOTAL_EMISSIONS_SUB_TASK, sectionsCompleted, defaultStatus)
            : '',
          linkText: aerTotalEmissionsMap.title,
          link: `${routePrefix}/${AER_TOTAL_EMISSIONS_SUB_TASK_PATH}`,
        },
      ],
    },
  ].filter(Boolean);
};

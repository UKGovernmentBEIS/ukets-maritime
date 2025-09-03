import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { OPERATOR_DETAILS_SUB_TASK } from '@requests/common/components/operator-details';
import { empAmendQuery } from '@requests/common/emp/+state';
import { ABBREVIATIONS_SUB_TASK } from '@requests/common/emp/subtasks/abbreviations';
import { CONTROL_ACTIVITIES_SUB_TASK } from '@requests/common/emp/subtasks/control-activities';
import { DATA_GAPS_SUB_TASK } from '@requests/common/emp/subtasks/data-gaps';
import { EMISSION_SOURCES_SUB_TASK } from '@requests/common/emp/subtasks/emission-sources';
import { GREENHOUSE_GAS_SUB_TASK } from '@requests/common/emp/subtasks/greenhouse-gas';
import { MANAGEMENT_PROCEDURES_SUB_TASK } from '@requests/common/emp/subtasks/management-procedures';
import { MANDATE_SUB_TASK, mandateSubtaskMap } from '@requests/common/emp/subtasks/mandate';
import {
  abbreviationsMap,
  additionalDocumentsMap,
  controlActivitiesMap,
  dataGapsMap,
  emissionSourcesMap,
  emissionsSubTasksMap,
  greenhouseGasMap,
  identifyMaritimeOperatorMap,
  managementProceduresMap,
  regulatorCommentsSubtaskMap,
} from '@requests/common/emp/subtasks/subtask-list.map';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { ADDITIONAL_DOCUMENTS_SUB_TASK } from '@requests/common/utils/additional-documents';
import { taskActionTypeToTitleMap } from '@shared/constants';

const routePrefix = 'emp-amend';
const REQUEST_CHANGES_HINT = 'Amends have been requested for this section.';

export const empAmendTaskContent: RequestTaskPageContentFactory = () => {
  const store: RequestTaskStore = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: taskActionTypeToTitleMap?.[requestTaskType],
    sections: [
      {
        title: regulatorCommentsSubtaskMap.title,
        tasks: [
          {
            name: 'variation-details',
            status: store.select(empAmendQuery.selectStatusForRequestedChangesSubtask)(),
            linkText: regulatorCommentsSubtaskMap.requestedChanges.title,
            link: `${routePrefix}/requested-changes`,
          },
        ],
      },
      {
        title: 'Account details',
        tasks: [
          {
            name: OPERATOR_DETAILS_SUB_TASK,
            status: store.select(empAmendQuery.selectStatusForSubtask(OPERATOR_DETAILS_SUB_TASK))(),
            linkText: identifyMaritimeOperatorMap.title,
            warningHint: store.select(empAmendQuery.selectIsChangesRequestedForSection(OPERATOR_DETAILS_SUB_TASK))()
              ? REQUEST_CHANGES_HINT
              : null,
            link: `${routePrefix}/operator-details`,
          },
        ],
      },
      {
        title: 'Emissions monitoring',
        tasks: [
          {
            name: EMISSIONS_SUB_TASK,
            status: store.select(empAmendQuery.selectStatusForSubtask(EMISSIONS_SUB_TASK))(),
            linkText: emissionsSubTasksMap.title,
            warningHint: store.select(empAmendQuery.selectIsChangesRequestedForSection(EMISSIONS_SUB_TASK))()
              ? REQUEST_CHANGES_HINT
              : null,
            link: `${routePrefix}/emissions`,
          },
          {
            name: EMISSION_SOURCES_SUB_TASK,
            status: store.select(empAmendQuery.selectStatusForSubtask(EMISSION_SOURCES_SUB_TASK))(),
            linkText: emissionSourcesMap.title,
            warningHint: store.select(empAmendQuery.selectIsChangesRequestedForSection(EMISSION_SOURCES_SUB_TASK))()
              ? REQUEST_CHANGES_HINT
              : null,
            link: `${routePrefix}/emission-sources`,
          },
          {
            name: GREENHOUSE_GAS_SUB_TASK,
            status: store.select(empAmendQuery.selectStatusForSubtask(GREENHOUSE_GAS_SUB_TASK))(),
            linkText: greenhouseGasMap.title,
            warningHint: store.select(empAmendQuery.selectIsChangesRequestedForSection(GREENHOUSE_GAS_SUB_TASK))()
              ? REQUEST_CHANGES_HINT
              : null,
            link: `${routePrefix}/greenhouse-gas`,
          },
          {
            name: DATA_GAPS_SUB_TASK,
            status: store.select(empAmendQuery.selectStatusForSubtask(DATA_GAPS_SUB_TASK))(),
            linkText: dataGapsMap.title,
            warningHint: store.select(empAmendQuery.selectIsChangesRequestedForSection(DATA_GAPS_SUB_TASK))()
              ? REQUEST_CHANGES_HINT
              : null,
            link: `${routePrefix}/data-gaps`,
          },
        ],
      },
      {
        title: 'Delegated UK ETS responsibility',
        tasks: [
          {
            name: MANDATE_SUB_TASK,
            status: store.select(empAmendQuery.selectStatusForSubtask(MANDATE_SUB_TASK))(),
            linkText: mandateSubtaskMap.title,
            warningHint: store.select(empAmendQuery.selectIsChangesRequestedForSection(MANDATE_SUB_TASK))()
              ? REQUEST_CHANGES_HINT
              : null,
            link: `${routePrefix}/${MANDATE_SUB_TASK}`,
          },
        ],
      },
      {
        title: 'Management procedures',
        tasks: [
          {
            name: MANAGEMENT_PROCEDURES_SUB_TASK,
            status: store.select(empAmendQuery.selectStatusForSubtask(MANAGEMENT_PROCEDURES_SUB_TASK))(),
            linkText: managementProceduresMap.title,
            warningHint: store.select(
              empAmendQuery.selectIsChangesRequestedForSection(MANAGEMENT_PROCEDURES_SUB_TASK),
            )()
              ? REQUEST_CHANGES_HINT
              : null,
            link: `${routePrefix}/management-procedures`,
          },
          {
            name: CONTROL_ACTIVITIES_SUB_TASK,
            status: store.select(empAmendQuery.selectStatusForSubtask(CONTROL_ACTIVITIES_SUB_TASK))(),
            linkText: controlActivitiesMap.title,
            warningHint: store.select(empAmendQuery.selectIsChangesRequestedForSection(CONTROL_ACTIVITIES_SUB_TASK))()
              ? REQUEST_CHANGES_HINT
              : null,
            link: `${routePrefix}/control-activities`,
          },
        ],
      },
      {
        title: 'Additional information',
        tasks: [
          {
            name: ABBREVIATIONS_SUB_TASK,
            status: store.select(empAmendQuery.selectStatusForSubtask(ABBREVIATIONS_SUB_TASK))(),
            linkText: abbreviationsMap.title,
            warningHint: store.select(empAmendQuery.selectIsChangesRequestedForSection(ABBREVIATIONS_SUB_TASK))()
              ? REQUEST_CHANGES_HINT
              : null,
            link: `${routePrefix}/abbreviations`,
          },
          {
            name: ADDITIONAL_DOCUMENTS_SUB_TASK,
            status: store.select(empAmendQuery.selectStatusForSubtask(ADDITIONAL_DOCUMENTS_SUB_TASK))(),
            linkText: additionalDocumentsMap.title,
            warningHint: store.select(empAmendQuery.selectIsChangesRequestedForSection(ADDITIONAL_DOCUMENTS_SUB_TASK))()
              ? REQUEST_CHANGES_HINT
              : null,
            link: `${routePrefix}/additional-documents`,
          },
        ],
      },
      {
        title: 'Send application',
        tasks: [
          {
            name: 'sendApplicationToRegulator',
            status: !store.select(empAmendQuery.selectIsEmpSectionCompleted)()
              ? TaskItemStatus.CANNOT_START_YET
              : TaskItemStatus.NOT_STARTED,
            linkText: 'Send application to regulator',
            link: !store.select(empAmendQuery.selectIsEmpSectionCompleted)() ? null : `${routePrefix}/send-application`,
          },
        ],
      },
    ],
  };
};

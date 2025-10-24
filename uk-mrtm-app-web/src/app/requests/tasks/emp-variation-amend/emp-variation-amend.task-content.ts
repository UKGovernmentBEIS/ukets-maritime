import { inject } from '@angular/core';

import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empAmendQuery, TaskItemStatus } from '@requests/common';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { OPERATOR_DETAILS_SUB_TASK } from '@requests/common/components/operator-details';
import { empVariationAmendsQuery } from '@requests/common/emp/+state/emp-variation-amends.selectors';
import { ABBREVIATIONS_SUB_TASK } from '@requests/common/emp/subtasks/abbreviations';
import { CONTROL_ACTIVITIES_SUB_TASK } from '@requests/common/emp/subtasks/control-activities';
import { DATA_GAPS_SUB_TASK } from '@requests/common/emp/subtasks/data-gaps';
import { EMISSION_SOURCES_SUB_TASK } from '@requests/common/emp/subtasks/emission-sources';
import { GREENHOUSE_GAS_SUB_TASK } from '@requests/common/emp/subtasks/greenhouse-gas';
import { MANAGEMENT_PROCEDURES_SUB_TASK } from '@requests/common/emp/subtasks/management-procedures';
import { MANDATE_SUB_TASK } from '@requests/common/emp/subtasks/mandate';
import { REQUESTED_CHANGES_SUB_TASK } from '@requests/common/emp/subtasks/requested-changes';
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
  mandateMap,
  regulatorCommentsSubtaskMap,
  variationDetailsSubtaskMap,
} from '@requests/common/emp/subtasks/subtask-list.map';
import { VARIATION_DETAILS_SUB_TASK } from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import { ADDITIONAL_DOCUMENTS_SUB_TASK } from '@requests/common/utils/additional-documents';
import { taskActionTypeToTitleMap } from '@shared/constants';

const routePrefix = 'emp-variation-amend';
const REQUEST_CHANGES_HINT = 'Amends have been requested for this section.';

export const empVariationAmendTaskContent: RequestTaskPageContentFactory = () => {
  const store: RequestTaskStore = inject(RequestTaskStore);
  const requestTaskType = store.select(requestTaskQuery.selectRequestTaskType)();

  return {
    header: taskActionTypeToTitleMap[requestTaskType],
    sections: [
      {
        title: regulatorCommentsSubtaskMap.title,
        tasks: [
          {
            name: REQUESTED_CHANGES_SUB_TASK,
            status: store.select(empVariationAmendsQuery.selectStatusForRequestChanges)(),
            linkText: regulatorCommentsSubtaskMap.requestedChanges.title,
            link: `${routePrefix}/requested-changes`,
          },
        ],
      },
      {
        title: variationDetailsSubtaskMap.title,
        tasks: [
          {
            name: VARIATION_DETAILS_SUB_TASK,
            status: store.select(empVariationAmendsQuery.selectStatusForVariationDetails)(),
            linkText: variationDetailsSubtaskMap.empVariationDetails.title,
            warningHint: store.select(empVariationAmendsQuery.selectIsChangesRequestedForVariationDetails)()
              ? REQUEST_CHANGES_HINT
              : null,
            link: `${routePrefix}/variation-details`,
          },
        ],
      },
      {
        title: 'Account details',
        tasks: [
          {
            name: OPERATOR_DETAILS_SUB_TASK,
            status: store.select(empVariationAmendsQuery.selectStatusForSubtask(OPERATOR_DETAILS_SUB_TASK))(),
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
            status: store.select(empVariationAmendsQuery.selectStatusForSubtask(EMISSIONS_SUB_TASK))(),
            linkText: emissionsSubTasksMap.title,
            warningHint: store.select(empAmendQuery.selectIsChangesRequestedForSection(EMISSIONS_SUB_TASK))()
              ? REQUEST_CHANGES_HINT
              : null,
            link: `${routePrefix}/emissions`,
          },
          {
            name: EMISSION_SOURCES_SUB_TASK,
            status: store.select(empVariationAmendsQuery.selectStatusForSubtask(EMISSION_SOURCES_SUB_TASK))(),
            linkText: emissionSourcesMap.title,
            warningHint: store.select(empAmendQuery.selectIsChangesRequestedForSection(EMISSION_SOURCES_SUB_TASK))()
              ? REQUEST_CHANGES_HINT
              : null,
            link: `${routePrefix}/emission-sources`,
          },
          {
            name: GREENHOUSE_GAS_SUB_TASK,
            status: store.select(empVariationAmendsQuery.selectStatusForSubtask(GREENHOUSE_GAS_SUB_TASK))(),
            linkText: greenhouseGasMap.title,
            warningHint: store.select(empAmendQuery.selectIsChangesRequestedForSection(GREENHOUSE_GAS_SUB_TASK))()
              ? REQUEST_CHANGES_HINT
              : null,
            link: `${routePrefix}/greenhouse-gas`,
          },
          {
            name: DATA_GAPS_SUB_TASK,
            status: store.select(empVariationAmendsQuery.selectStatusForSubtask(DATA_GAPS_SUB_TASK))(),
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
            status: store.select(empVariationAmendsQuery.selectStatusForSubtask(MANDATE_SUB_TASK))(),
            linkText: mandateMap.title,
            warningHint: store.select(empAmendQuery.selectIsChangesRequestedForSection(MANDATE_SUB_TASK))()
              ? REQUEST_CHANGES_HINT
              : null,
            link: `${routePrefix}/mandate`,
          },
        ],
      },
      {
        title: 'Management procedures',
        tasks: [
          {
            name: MANAGEMENT_PROCEDURES_SUB_TASK,
            status: store.select(empVariationAmendsQuery.selectStatusForSubtask(MANAGEMENT_PROCEDURES_SUB_TASK))(),
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
            status: store.select(empVariationAmendsQuery.selectStatusForSubtask(CONTROL_ACTIVITIES_SUB_TASK))(),
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
            status: store.select(empVariationAmendsQuery.selectStatusForSubtask(ABBREVIATIONS_SUB_TASK))(),
            linkText: abbreviationsMap.title,
            warningHint: store.select(empAmendQuery.selectIsChangesRequestedForSection(ABBREVIATIONS_SUB_TASK))()
              ? REQUEST_CHANGES_HINT
              : null,
            link: `${routePrefix}/abbreviations`,
          },
          {
            name: ADDITIONAL_DOCUMENTS_SUB_TASK,
            status: store.select(empVariationAmendsQuery.selectStatusForSubtask(ADDITIONAL_DOCUMENTS_SUB_TASK))(),
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
            name: 'sendVariationToRegulator',
            status: !store.select(empVariationAmendsQuery.selectIsEmpSectionCompleted)()
              ? TaskItemStatus.CANNOT_START_YET
              : TaskItemStatus.NOT_STARTED,
            linkText: 'Send application to regulator',
            link: store.select(empVariationAmendsQuery.selectIsEmpSectionCompleted)()
              ? `${routePrefix}/send-variation`
              : null,
          },
        ],
      },
    ],
  };
};

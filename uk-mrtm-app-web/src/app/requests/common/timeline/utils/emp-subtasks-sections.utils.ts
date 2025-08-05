import { inject } from '@angular/core';

import { TaskSection } from '@netz/common/model';
import { RequestTaskPageContentFactory } from '@netz/common/request-task';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { OPERATOR_DETAILS_SUB_TASK } from '@requests/common/components/operator-details';
import { ABBREVIATIONS_SUB_TASK } from '@requests/common/emp/subtasks/abbreviations';
import { CONTROL_ACTIVITIES_SUB_TASK } from '@requests/common/emp/subtasks/control-activities';
import { DATA_GAPS_SUB_TASK } from '@requests/common/emp/subtasks/data-gaps';
import { EMISSION_SOURCES_SUB_TASK } from '@requests/common/emp/subtasks/emission-sources';
import { GREENHOUSE_GAS_SUB_TASK } from '@requests/common/emp/subtasks/greenhouse-gas';
import { MANAGEMENT_PROCEDURES_SUB_TASK } from '@requests/common/emp/subtasks/management-procedures';
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
  variationDetailsSubtaskMap,
} from '@requests/common/emp/subtasks/subtask-list.map';
import { VARIATION_DETAILS_SUB_TASK } from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import { ADDITIONAL_DOCUMENTS_SUB_TASK } from '@requests/common/utils/additional-documents';
import { taskActionTypeToTitleMap } from '@shared/constants';

export const getEmpSubtaskSections = (routePrefix: string, isVariation: boolean = false): Array<TaskSection> =>
  [
    isVariation
      ? {
          title: 'Variation details',
          tasks: [
            {
              name: VARIATION_DETAILS_SUB_TASK,
              status: '',
              linkText: variationDetailsSubtaskMap.empVariationDetails.title,
              link: `${routePrefix}/variation-details`,
            },
          ],
        }
      : null,
    {
      title: 'Account details',
      tasks: [
        {
          name: OPERATOR_DETAILS_SUB_TASK,
          status: '',
          linkText: identifyMaritimeOperatorMap.title,
          link: `${routePrefix}/operator-details`,
        },
      ],
    },
    {
      title: 'Emissions monitoring',
      tasks: [
        {
          name: EMISSIONS_SUB_TASK,
          status: '',
          linkText: emissionsSubTasksMap.title,
          link: `${routePrefix}/emissions`,
        },
        {
          name: EMISSION_SOURCES_SUB_TASK,
          status: '',
          linkText: emissionSourcesMap.title,
          link: `${routePrefix}/emission-sources`,
        },
        {
          name: GREENHOUSE_GAS_SUB_TASK,
          status: '',
          linkText: greenhouseGasMap.title,
          link: `${routePrefix}/greenhouse-gas`,
        },
        {
          name: DATA_GAPS_SUB_TASK,
          status: '',
          linkText: dataGapsMap.title,
          link: `${routePrefix}/data-gaps`,
        },
      ],
    },
    {
      title: 'Management procedures',
      tasks: [
        {
          name: MANAGEMENT_PROCEDURES_SUB_TASK,
          status: '',
          linkText: managementProceduresMap.title,
          link: `${routePrefix}/management-procedures`,
        },
        {
          name: CONTROL_ACTIVITIES_SUB_TASK,
          status: '',
          linkText: controlActivitiesMap.title,
          link: `${routePrefix}/control-activities`,
        },
      ],
    },
    {
      title: 'Additional information',
      tasks: [
        {
          name: ABBREVIATIONS_SUB_TASK,
          status: '',
          linkText: abbreviationsMap.title,
          link: `${routePrefix}/abbreviations`,
        },
        {
          name: ADDITIONAL_DOCUMENTS_SUB_TASK,
          status: '',
          linkText: additionalDocumentsMap.title,
          link: `${routePrefix}/additional-documents`,
        },
      ],
    },
  ].filter(Boolean);

export const getEmpTaskSectionsContent =
  (routePrefix: string, isVariation: boolean = false): RequestTaskPageContentFactory =>
  () => {
    const store = inject(RequestActionStore);
    const action = store.select(requestActionQuery.selectAction)();

    return {
      header: taskActionTypeToTitleMap?.[action?.type],
      sections: getEmpSubtaskSections(routePrefix, isVariation),
    };
  };

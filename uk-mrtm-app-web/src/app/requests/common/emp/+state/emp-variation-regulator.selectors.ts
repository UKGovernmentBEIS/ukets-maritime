import {
  AdditionalDocuments,
  EmissionsMonitoringPlan,
  EmissionsMonitoringPlanContainer,
  EmpAbbreviations,
  EmpAcceptedVariationDecisionDetails,
  EmpControlActivities,
  EmpDataGaps,
  EmpEmissions,
  EmpEmissionSources,
  EmpManagementProcedures,
  EmpMonitoringGreenhouseGas,
  EmpOperatorDetails,
  EmpVariationDetails,
  EmpVariationRegulatorLedReason,
} from '@mrtm/api';

import { createAggregateSelector, createDescendingSelector, RequestTaskState, StateSelector } from '@netz/common/store';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { OPERATOR_DETAILS_SUB_TASK } from '@requests/common/components/operator-details';
import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpVariationRegulatorTaskPayload } from '@requests/common/emp/emp.types';
import { ABBREVIATIONS_SUB_TASK } from '@requests/common/emp/subtasks/abbreviations';
import { CONTROL_ACTIVITIES_SUB_TASK } from '@requests/common/emp/subtasks/control-activities';
import { DATA_GAPS_SUB_TASK } from '@requests/common/emp/subtasks/data-gaps';
import { EMISSION_SOURCES_SUB_TASK } from '@requests/common/emp/subtasks/emission-sources';
import { GREENHOUSE_GAS_SUB_TASK } from '@requests/common/emp/subtasks/greenhouse-gas';
import { MANAGEMENT_PROCEDURES_SUB_TASK } from '@requests/common/emp/subtasks/management-procedures';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { ADDITIONAL_DOCUMENTS_SUB_TASK } from '@requests/common/utils/additional-documents';
import { AttachedFile, ShipEmissionTableListItem } from '@shared/types';

const selectStatusForSubtask = (
  subtask: keyof EmissionsMonitoringPlan,
): StateSelector<RequestTaskState, TaskItemStatus> => {
  return createDescendingSelector(
    empCommonQuery.selectEmpSectionsCompleted,
    (completed) => (completed?.[subtask] as TaskItemStatus) ?? TaskItemStatus.COMPLETED,
  );
};

const selectOriginalEmissionsMonitoringPlan: StateSelector<RequestTaskState, EmissionsMonitoringPlan> =
  createDescendingSelector(
    empCommonQuery.selectPayload<EmpVariationRegulatorTaskPayload>(),
    (payload) => payload?.originalEmpContainer?.emissionsMonitoringPlan,
  );

const selectOriginalOperatorDetails: StateSelector<RequestTaskState, EmpOperatorDetails> = createDescendingSelector(
  selectOriginalEmissionsMonitoringPlan,
  (originalEmp) => originalEmp?.operatorDetails,
);

const selectOriginalAdditionalDocuments: StateSelector<RequestTaskState, AdditionalDocuments> =
  createDescendingSelector(selectOriginalEmissionsMonitoringPlan, (originalEmp) => originalEmp?.additionalDocuments);

const selectOriginalAbbreviations: StateSelector<RequestTaskState, EmpAbbreviations> = createDescendingSelector(
  selectOriginalEmissionsMonitoringPlan,
  (originalEmp) => originalEmp?.abbreviations,
);

const selectOriginalManagementProcedures: StateSelector<RequestTaskState, EmpManagementProcedures> =
  createDescendingSelector(selectOriginalEmissionsMonitoringPlan, (originalEmp) => originalEmp?.managementProcedures);

const selectOriginalControlActivities: StateSelector<RequestTaskState, EmpControlActivities> = createDescendingSelector(
  selectOriginalEmissionsMonitoringPlan,
  (originalEmp) => originalEmp?.controlActivities,
);

const selectOriginalDataGaps: StateSelector<RequestTaskState, EmpDataGaps> = createDescendingSelector(
  selectOriginalEmissionsMonitoringPlan,
  (originalEmp) => originalEmp?.dataGaps,
);

const selectOriginalGreenhouseGas: StateSelector<RequestTaskState, EmpMonitoringGreenhouseGas> =
  createDescendingSelector(selectOriginalEmissionsMonitoringPlan, (originalEmp) => originalEmp?.greenhouseGas);

const selectOriginalEmissionSources: StateSelector<RequestTaskState, EmpEmissionSources> = createDescendingSelector(
  selectOriginalEmissionsMonitoringPlan,
  (originalEmp) => originalEmp?.sources,
);

const selectOriginalEmissions: StateSelector<RequestTaskState, EmpEmissions> = createDescendingSelector(
  selectOriginalEmissionsMonitoringPlan,
  (originalEmp) => originalEmp?.emissions,
);

const selectOriginalListOfShips: StateSelector<RequestTaskState, ShipEmissionTableListItem[]> =
  createDescendingSelector(selectOriginalEmissions, (emissions) =>
    emissions?.ships?.map((x) => ({
      uniqueIdentifier: x.uniqueIdentifier,
      ...x.details,
      status: TaskItemStatus.COMPLETED,
    })),
  );

const selectOriginalEmpAttachments: StateSelector<
  RequestTaskState,
  EmissionsMonitoringPlanContainer['empAttachments']
> = createDescendingSelector(
  empCommonQuery.selectPayload<EmpVariationRegulatorTaskPayload>(),
  (payload) => payload?.originalEmpContainer?.empAttachments,
);

const selectVariationRegulatorReviewGroupDecisions: StateSelector<
  RequestTaskState,
  { [key: string]: EmpAcceptedVariationDecisionDetails }
> = createDescendingSelector(
  empCommonQuery.selectPayload<EmpVariationRegulatorTaskPayload>(),
  (payload) => payload?.reviewGroupDecisions,
);

const selectSubtaskVariationDecisionDetails = (
  subtask: keyof EmissionsMonitoringPlan,
): StateSelector<RequestTaskState, EmpAcceptedVariationDecisionDetails> => {
  return createDescendingSelector(selectVariationRegulatorReviewGroupDecisions, (reviewGroupDecisions) => {
    const group = subtaskReviewGroupMap[subtask];
    return reviewGroupDecisions?.[group];
  });
};

const selectOriginalAttachedFiles = (files?: Array<string>): StateSelector<RequestTaskState, AttachedFile[]> =>
  createAggregateSelector(
    empCommonQuery.selectTasksDownloadUrl,
    selectOriginalEmpAttachments,
    (downloadUrl, payload) => {
      return (
        files?.map((id) => ({
          downloadUrl: downloadUrl + `${id}`,
          fileName: payload?.[id],
        })) ?? []
      );
    },
  );

const selectEmpVariationDetails: StateSelector<RequestTaskState, EmpVariationDetails> = createDescendingSelector(
  empCommonQuery.selectPayload<EmpVariationRegulatorTaskPayload>(),
  (payload) => payload?.empVariationDetails,
);

const selectReasonRegulatorLed: StateSelector<RequestTaskState, EmpVariationRegulatorLedReason> =
  createDescendingSelector(
    empCommonQuery.selectPayload<EmpVariationRegulatorTaskPayload>(),
    (payload) => payload?.reasonRegulatorLed,
  );

const selectEmpVariationDetailsCompleted: StateSelector<RequestTaskState, TaskItemStatus> = createDescendingSelector(
  empCommonQuery.selectPayload<EmpVariationRegulatorTaskPayload>(),
  (payload) => payload?.empVariationDetailsCompleted as TaskItemStatus,
);

const selectAreAllSectionsAccepted: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  empCommonQuery.selectEmpSectionsCompleted,
  selectEmpVariationDetailsCompleted,
  (completed, empVariationDetailsCompleted) => {
    const allTasks = [
      ABBREVIATIONS_SUB_TASK,
      ADDITIONAL_DOCUMENTS_SUB_TASK,
      CONTROL_ACTIVITIES_SUB_TASK,
      DATA_GAPS_SUB_TASK,
      EMISSION_SOURCES_SUB_TASK,
      EMISSIONS_SUB_TASK,
      GREENHOUSE_GAS_SUB_TASK,
      MANAGEMENT_PROCEDURES_SUB_TASK,
      OPERATOR_DETAILS_SUB_TASK,
    ];
    const allTaskCompleted = allTasks.every(
      (task) => (completed?.[task] as TaskItemStatus) === TaskItemStatus.COMPLETED || completed?.[task] === undefined,
    );
    return allTaskCompleted && empVariationDetailsCompleted === TaskItemStatus.COMPLETED;
  },
);

export const empVariationRegulatorQuery = {
  selectStatusForSubtask,
  selectOriginalOperatorDetails,
  selectOriginalAdditionalDocuments,
  selectOriginalAbbreviations,
  selectOriginalManagementProcedures,
  selectOriginalControlActivities,
  selectOriginalDataGaps,
  selectOriginalGreenhouseGas,
  selectOriginalEmissionSources,
  selectVariationRegulatorReviewGroupDecisions,
  selectOriginalListOfShips,
  selectSubtaskVariationDecisionDetails,
  selectOriginalAttachedFiles,
  selectEmpVariationDetails,
  selectReasonRegulatorLed,
  selectAreAllSectionsAccepted,
};

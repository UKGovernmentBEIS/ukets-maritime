import {
  EmissionsMonitoringPlan,
  EmissionsMonitoringPlanContainer,
  EmpAcceptedVariationDecisionDetails,
  EmpEmissions,
} from '@mrtm/api';

import { createAggregateSelector, createDescendingSelector, RequestTaskState, StateSelector } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state/emp-common.selectors';
import { EmpVariationRegulatorPeerReviewTaskPayload } from '@requests/common/emp/emp.types';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { AttachedFile, ShipEmissionTableListItem } from '@shared/types';

const selectReviewGroupDecisions: StateSelector<
  RequestTaskState,
  { [key: string]: EmpAcceptedVariationDecisionDetails }
> = createDescendingSelector(
  empCommonQuery.selectPayload<EmpVariationRegulatorPeerReviewTaskPayload>(),
  (payload) => payload?.reviewGroupDecisions as { [key: string]: EmpAcceptedVariationDecisionDetails },
);

const selectStatusForEmpVariationDetailsSubtask: StateSelector<RequestTaskState, TaskItemStatus> =
  createDescendingSelector(
    empCommonQuery.selectPayload<EmpVariationRegulatorPeerReviewTaskPayload>(),
    (payload) => (payload?.empVariationDetailsCompleted as TaskItemStatus) ?? TaskItemStatus.UNDECIDED,
  );

const selectEmpVariationDetails: StateSelector<
  RequestTaskState,
  EmpVariationRegulatorPeerReviewTaskPayload['empVariationDetails']
> = createDescendingSelector(
  empCommonQuery.selectPayload<EmpVariationRegulatorPeerReviewTaskPayload>(),
  (payload) => payload?.empVariationDetails,
);

const selectReasonRegulatorLed: StateSelector<
  RequestTaskState,
  EmpVariationRegulatorPeerReviewTaskPayload['reasonRegulatorLed']
> = createDescendingSelector(
  empCommonQuery.selectPayload<EmpVariationRegulatorPeerReviewTaskPayload>(),
  (payload) => payload?.reasonRegulatorLed,
);

const selectOriginalEmissionsMonitoringPlan: StateSelector<RequestTaskState, EmissionsMonitoringPlan> =
  createDescendingSelector(
    empCommonQuery.selectPayload<EmpVariationRegulatorPeerReviewTaskPayload>(),
    (payload) => payload?.originalEmpContainer?.emissionsMonitoringPlan,
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
  empCommonQuery.selectPayload<EmpVariationRegulatorPeerReviewTaskPayload>(),
  (payload) => payload?.originalEmpContainer?.empAttachments,
);

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

export const empVariationRegulatorPeerReviewQuery = {
  selectStatusForEmpVariationDetailsSubtask,
  selectEmpVariationDetails,
  selectReviewGroupDecisions,
  selectReasonRegulatorLed,
  selectOriginalEmissionsMonitoringPlan,
  selectOriginalAttachedFiles,
  selectOriginalListOfShips,
};

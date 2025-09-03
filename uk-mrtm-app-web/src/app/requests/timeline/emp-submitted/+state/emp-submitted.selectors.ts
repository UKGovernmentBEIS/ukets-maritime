import {
  AdditionalDocuments,
  EmissionsMonitoringPlan,
  EmpAbbreviations,
  EmpControlActivities,
  EmpDataGaps,
  EmpEmissions,
  EmpEmissionSources,
  EmpIssuanceApplicationSubmittedRequestActionPayload,
  EmpManagementProcedures,
  EmpMandate,
  EmpMonitoringGreenhouseGas,
  EmpOperatorDetails,
  EmpShipEmissions,
} from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { TaskItemStatus, timelineCommonQuery, timelineUtils } from '@requests/common';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { AttachedFile, ShipEmissionTableListItem } from '@shared/types';

const selectPayload: StateSelector<RequestActionState, EmpIssuanceApplicationSubmittedRequestActionPayload> =
  timelineCommonQuery.selectPayload<EmpIssuanceApplicationSubmittedRequestActionPayload>();

const selectEmpSectionsCompleted: StateSelector<
  RequestActionState,
  EmpIssuanceApplicationSubmittedRequestActionPayload['empSectionsCompleted']
> = createDescendingSelector(selectPayload, (payload) => payload?.empSectionsCompleted);

const selectStatusForSubtask = (
  subtask: keyof EmissionsMonitoringPlan,
): StateSelector<RequestActionState, TaskItemStatus> => {
  return createDescendingSelector(
    selectEmpSectionsCompleted,
    (completed) => (completed?.[subtask] as TaskItemStatus) ?? TaskItemStatus.NOT_STARTED,
  );
};

const selectIsSubtaskCompleted = (
  subtask: keyof EmissionsMonitoringPlan,
): StateSelector<RequestActionState, boolean> => {
  return createDescendingSelector(
    selectEmpSectionsCompleted,
    (completed) => (completed?.[subtask] as TaskItemStatus) === TaskItemStatus.COMPLETED,
  );
};

const selectAbbreviations: StateSelector<RequestActionState, EmpAbbreviations> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.emissionsMonitoringPlan?.abbreviations,
);

const selectAdditionalDocuments: StateSelector<RequestActionState, AdditionalDocuments> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.emissionsMonitoringPlan?.additionalDocuments,
);

const selectAttachedFiles = (files?: Array<string>): StateSelector<RequestActionState, AttachedFile[]> =>
  createAggregateSelector(timelineCommonQuery.selectDownloadUrl, selectPayload, (downloadUrl, payload) =>
    timelineUtils.getAttachedFiles(files, payload?.empAttachments, downloadUrl),
  );

const selectManagementProcedures: StateSelector<RequestActionState, EmpManagementProcedures> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.emissionsMonitoringPlan?.managementProcedures,
);

const selectOperatorDetails: StateSelector<RequestActionState, EmpOperatorDetails> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.emissionsMonitoringPlan?.operatorDetails,
);

const selectControlActivities: StateSelector<RequestActionState, EmpControlActivities> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.emissionsMonitoringPlan?.controlActivities,
);

const selectDataGaps: StateSelector<RequestActionState, EmpDataGaps> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.emissionsMonitoringPlan?.dataGaps,
);

const selectGreenhouseGas: StateSelector<RequestActionState, EmpMonitoringGreenhouseGas> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.emissionsMonitoringPlan?.greenhouseGas,
);

const selectEmissionSources: StateSelector<RequestActionState, EmpEmissionSources> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.emissionsMonitoringPlan?.sources,
);

const selectEmissions: StateSelector<RequestActionState, EmpEmissions> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.emissionsMonitoringPlan?.emissions,
);

const selectShips: StateSelector<RequestActionState, EmpShipEmissions[]> = createDescendingSelector(
  selectEmissions,
  (payload) => payload?.ships ?? [],
);

const selectListOfShips: StateSelector<RequestActionState, ShipEmissionTableListItem[]> = createAggregateSelector(
  selectShips,
  selectEmpSectionsCompleted,
  (ships, completed) =>
    ships.map((x) => ({
      uniqueIdentifier: x.uniqueIdentifier,
      ...x.details,
      status: (completed?.[`${EMISSIONS_SUB_TASK}-ship-${x.uniqueIdentifier}`] ??
        TaskItemStatus.COMPLETED) as TaskItemStatus,
    })),
);

const selectShip = (
  shipId: EmpShipEmissions['uniqueIdentifier'],
): StateSelector<RequestActionState, EmpShipEmissions> =>
  createDescendingSelector(selectShips, (ships) => ships?.find((ship) => ship.uniqueIdentifier === shipId));

const selectMandate: StateSelector<RequestActionState, EmpMandate> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.emissionsMonitoringPlan?.mandate,
);

export const empSubmittedQuery = {
  selectIsSubtaskCompleted,
  selectStatusForSubtask,
  selectAttachedFiles,
  selectOperatorDetails,
  selectDataGaps,
  selectAdditionalDocuments,
  selectAbbreviations,
  selectManagementProcedures,
  selectControlActivities,
  selectGreenhouseGas,
  selectEmissionSources,
  selectShip,
  selectListOfShips,
  selectMandate,
};

import {
  AdditionalDocuments,
  EmissionsMonitoringPlan,
  EmpAbbreviations,
  EmpControlActivities,
  EmpDataGaps,
  EmpEmissions,
  EmpEmissionSources,
  EmpEmissionsSources,
  EmpFuelsAndEmissionsFactors,
  EmpManagementProcedures,
  EmpMandate,
  EmpMonitoringGreenhouseGas,
  EmpOperatorDetails,
  EmpRegisteredOwner,
  EmpShipEmissions,
  RegisteredOwnerShipDetails,
  ShipDetails,
} from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmpCommonTaskPayload } from '@requests/common/emp/emp.types';
import { EMP_SUBTASKS } from '@requests/common/emp/emp-subtasks.constant';
import { empTaskSectionsCompletedDefaultStatusMap } from '@requests/common/emp/utils';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { monitoringMethodMap } from '@shared/constants';
import { AttachedFile, ShipEmissionTableListItem } from '@shared/types';

const selectPayload = <T = EmpCommonTaskPayload>(): StateSelector<RequestTaskState, T> =>
  createDescendingSelector(requestTaskQuery.selectRequestTaskPayload, (payload) => payload as T);

const selectEmpAttachments: StateSelector<RequestTaskState, EmpCommonTaskPayload['empAttachments']> =
  createDescendingSelector(selectPayload(), (payload) => payload?.empAttachments);

const selectEmpSectionsCompleted: StateSelector<RequestTaskState, EmpCommonTaskPayload['empSectionsCompleted']> =
  createDescendingSelector(selectPayload(), (payload) => payload?.empSectionsCompleted);

const selectStatusForSubtask = (
  subtask: keyof EmissionsMonitoringPlan | string,
  defaultStatus?: TaskItemStatus,
): StateSelector<RequestTaskState, TaskItemStatus> => {
  return createAggregateSelector(
    requestTaskQuery.selectRequestTaskType,
    selectEmpSectionsCompleted,
    (type, completed) => {
      const taskStatus = completed?.[subtask] as TaskItemStatus;

      return (
        taskStatus ??
        (defaultStatus
          ? defaultStatus
          : (empTaskSectionsCompletedDefaultStatusMap?.[type] ?? TaskItemStatus.NOT_STARTED))
      );
    },
  );
};

const selectIsEmpSectionCompleted: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  requestTaskQuery.selectRequestTaskType,
  selectEmpSectionsCompleted,
  (taskType, completed) => {
    const defaultState = empTaskSectionsCompletedDefaultStatusMap[taskType] ?? TaskItemStatus.NOT_STARTED;

    for (const key of EMP_SUBTASKS) {
      if ((completed?.[key] ?? defaultState) !== TaskItemStatus.COMPLETED) {
        return false;
      }
    }

    return true;
  },
);

const selectIsSubtaskCompleted = (subtask: keyof EmissionsMonitoringPlan): StateSelector<RequestTaskState, boolean> => {
  return createDescendingSelector(
    selectStatusForSubtask(subtask),
    (status) => (status as TaskItemStatus) === TaskItemStatus.COMPLETED,
  );
};

const selectAbbreviations: StateSelector<RequestTaskState, EmpAbbreviations> = createDescendingSelector(
  selectPayload(),
  (payload) => payload?.emissionsMonitoringPlan?.abbreviations,
);

const selectAdditionalDocuments: StateSelector<RequestTaskState, AdditionalDocuments> = createDescendingSelector(
  selectPayload(),
  (payload) => payload?.emissionsMonitoringPlan?.additionalDocuments,
);

const selectTasksDownloadUrl = requestTaskQuery.selectTasksDownloadUrl;

const selectAttachedFiles = (files?: Array<string>): StateSelector<RequestTaskState, AttachedFile[]> =>
  createAggregateSelector(selectTasksDownloadUrl, selectEmpAttachments, (downloadUrl, payload) => {
    return (
      files?.map((id) => ({
        downloadUrl: downloadUrl + `${id}`,
        fileName: payload?.[id],
      })) ?? []
    );
  });

const selectManagementProcedures: StateSelector<RequestTaskState, EmpManagementProcedures> = createDescendingSelector(
  selectPayload(),
  (payload) => payload?.emissionsMonitoringPlan?.managementProcedures,
);

const selectOperatorDetails: StateSelector<RequestTaskState, EmpOperatorDetails> = createDescendingSelector(
  selectPayload(),
  (payload) => payload?.emissionsMonitoringPlan?.operatorDetails,
);

const selectControlActivities: StateSelector<RequestTaskState, EmpControlActivities> = createDescendingSelector(
  selectPayload(),
  (payload) => payload?.emissionsMonitoringPlan?.controlActivities,
);

const selectDataGaps: StateSelector<RequestTaskState, EmpDataGaps> = createDescendingSelector(
  selectPayload(),
  (payload) => payload?.emissionsMonitoringPlan?.dataGaps,
);

const selectGreenhouseGas: StateSelector<RequestTaskState, EmpMonitoringGreenhouseGas> = createDescendingSelector(
  selectPayload(),
  (payload) => payload?.emissionsMonitoringPlan?.greenhouseGas,
);

const selectEmissionSources: StateSelector<RequestTaskState, EmpEmissionSources> = createDescendingSelector(
  selectPayload(),
  (payload) => payload?.emissionsMonitoringPlan?.sources,
);

const selectEmissions: StateSelector<RequestTaskState, EmpEmissions> = createDescendingSelector(
  selectPayload(),
  (payload) => payload?.emissionsMonitoringPlan?.emissions,
);

const selectShips: StateSelector<
  RequestTaskState,
  Array<EmpShipEmissions & { status: TaskItemStatus }>
> = createAggregateSelector(selectEmissions, selectEmpSectionsCompleted, (emissions, completed) =>
  (emissions?.ships ?? [])
    .map((ship) => ({
      ...ship,
      status: (completed?.[`${EMISSIONS_SUB_TASK}-ship-${ship.uniqueIdentifier}`] ??
        TaskItemStatus.COMPLETED) as TaskItemStatus,
    }))
    .slice()
    .sort((a, b) => a?.details?.name?.localeCompare(b?.details?.name)),
);

const selectListOfShips: StateSelector<RequestTaskState, ShipEmissionTableListItem[]> = createAggregateSelector(
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

const selectShip = (shipId: EmpShipEmissions['uniqueIdentifier']): StateSelector<RequestTaskState, EmpShipEmissions> =>
  createDescendingSelector(selectShips, (ships) => ships?.find((ship) => ship.uniqueIdentifier === shipId));

const selectShipName = (shipId: EmpShipEmissions['uniqueIdentifier']): StateSelector<RequestTaskState, string> =>
  createDescendingSelector(selectShip(shipId), (ship) => ship?.details?.name);

const selectShipFuelsAndEmissionsFactors = (
  shipId: EmpShipEmissions['uniqueIdentifier'],
): StateSelector<RequestTaskState, EmpFuelsAndEmissionsFactors[]> =>
  createDescendingSelector(selectShip(shipId), (ship) => ship?.fuelsAndEmissionsFactors ?? []);

const selectShipFuelsAndEmissionsFactorsItem = (
  shipId: EmpShipEmissions['uniqueIdentifier'],
  factoryId: EmpFuelsAndEmissionsFactors['uniqueIdentifier'],
) =>
  createDescendingSelector(selectShipFuelsAndEmissionsFactors(shipId), (items) =>
    (items ?? []).find((item) => item.uniqueIdentifier === factoryId),
  );

const selectShipEmissionSources = (shipId: EmpShipEmissions['uniqueIdentifier']) =>
  createDescendingSelector(selectShip(shipId), (ship) => ship?.emissionsSources ?? []);

const selectShipEmissionSource = (
  shipId: EmpShipEmissions['uniqueIdentifier'],
  sourceId: EmpEmissionsSources['uniqueIdentifier'],
) =>
  createDescendingSelector(selectShipEmissionSources(shipId), (sources) =>
    sources.find((source) => source.uniqueIdentifier === sourceId),
  );

const selectShipUncertaintyLevel = (shipId: EmpShipEmissions['uniqueIdentifier']) =>
  createDescendingSelector(selectShip(shipId), (ship) => ship?.uncertaintyLevel);

const selectShipMonitoringMethods = (shipId: EmpShipEmissions['uniqueIdentifier']) =>
  createDescendingSelector(selectShipEmissionSources(shipId), (emissionSources) =>
    Array.from(
      new Set(
        (emissionSources ?? [])
          .map((source) => source?.monitoringMethod)
          .flat()
          .sort((a, b) => monitoringMethodMap?.[a]?.text?.localeCompare(monitoringMethodMap?.[b]?.text)),
      ),
    ),
  );

const selectShipMeasurements = (
  shipId: EmpShipEmissions['uniqueIdentifier'],
): StateSelector<RequestTaskState, EmpShipEmissions['measurements']> =>
  createDescendingSelector(selectShip(shipId), (ship) => ship?.measurements);

const selectShipEmissionSourcesNames = (
  shipId: EmpShipEmissions['uniqueIdentifier'],
): StateSelector<RequestTaskState, string[]> =>
  createDescendingSelector(selectShipEmissionSources(shipId), (sources) =>
    sources ? sources.map((source) => source?.name) : [],
  );

const selectShipCarbonCapture = (
  shipId: EmpShipEmissions['uniqueIdentifier'],
): StateSelector<RequestTaskState, EmpShipEmissions['carbonCapture']> =>
  createDescendingSelector(selectShip(shipId), (ship) => ship?.carbonCapture);

const selectExemptionConditions = (
  shipId: EmpShipEmissions['uniqueIdentifier'],
): StateSelector<RequestTaskState, EmpShipEmissions['exemptionConditions']> =>
  createDescendingSelector(selectShip(shipId), (ship) => ship?.exemptionConditions);

const selectIsShipStatusCompleted = (
  shipId: EmpShipEmissions['uniqueIdentifier'],
): StateSelector<RequestTaskState, boolean> => {
  return createDescendingSelector(
    selectEmpSectionsCompleted,
    (completed) => (completed?.[`${EMISSIONS_SUB_TASK}-ship-${shipId}`] as TaskItemStatus) === TaskItemStatus.COMPLETED,
  );
};

const selectIsVariationRegulator: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskType,
  (requestTaskType) => requestTaskType === 'EMP_VARIATION_REGULATOR_LED_APPLICATION_SUBMIT',
);

const selectHasReview: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskType,
  (requestTaskType) =>
    requestTaskType === 'EMP_ISSUANCE_APPLICATION_REVIEW' ||
    requestTaskType === 'EMP_ISSUANCE_APPLICATION_PEER_REVIEW' ||
    requestTaskType === 'EMP_VARIATION_APPLICATION_REVIEW',
);

const selectIsPeerReview: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskType,
  (requestTaskType) => requestTaskType === 'EMP_ISSUANCE_APPLICATION_PEER_REVIEW',
);

const selectAnySubtaskNeedsAmend: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectEmpSectionsCompleted,
  (completed) => Object.values(completed ?? {}).includes(TaskItemStatus.OPERATOR_AMENDS_NEEDED),
);

export const selectMandate: StateSelector<RequestTaskState, EmpMandate> = createDescendingSelector(
  selectPayload(),
  (payload) => payload?.emissionsMonitoringPlan?.mandate,
);

export const selectMandateRegisteredOwners: StateSelector<RequestTaskState, EmpMandate['registeredOwners']> =
  createDescendingSelector(selectMandate, (payload) => payload?.registeredOwners ?? []);

export const selectMandateRegisteredOwnersList: StateSelector<
  RequestTaskState,
  Array<EmpRegisteredOwner & { needsReview: boolean }>
> = createAggregateSelector(selectMandateRegisteredOwners, selectShips, (registeredOwners, ships) => {
  const empShips = (ships ?? []).filter((ship) => ship?.details?.natureOfReportingResponsibility === 'ISM_COMPANY');

  return (registeredOwners ?? []).map((registeredOwner: EmpRegisteredOwner) => {
    let needsReview = false;
    const ships: EmpRegisteredOwner['ships'] = [];

    for (const roShip of registeredOwner.ships) {
      const sourceShip = empShips.find((empShip) => empShip?.details?.imoNumber === roShip.imoNumber);
      if (!sourceShip || sourceShip?.status !== TaskItemStatus.COMPLETED) {
        needsReview = true;
        continue;
      }

      ships.push(roShip);
    }

    return {
      ...registeredOwner,
      needsReview,
      ships,
    };
  });
});

export const selectExtendedMandate: StateSelector<
  RequestTaskState,
  Omit<EmpMandate, 'registeredOwners'> & {
    registeredOwners: Array<EmpRegisteredOwner & { needsReview: boolean }>;
  }
> = createAggregateSelector(selectMandate, selectMandateRegisteredOwnersList, (mandate, registeredOwners) => ({
  ...mandate,
  registeredOwners,
}));

export const selectMandateRegisteredOwnerByUniqueIdentifier = (
  uniqueIdentifier: EmpRegisteredOwner['uniqueIdentifier'],
): StateSelector<RequestTaskState, EmpRegisteredOwner> =>
  createDescendingSelector(selectMandateRegisteredOwners, (payload) =>
    payload?.find((registeredOwner) => registeredOwner.uniqueIdentifier === uniqueIdentifier),
  );

export const selectMandateRegisteredOwnerAvailableShips = (
  registeredOwnerId: EmpRegisteredOwner['uniqueIdentifier'],
): StateSelector<RequestTaskState, Array<RegisteredOwnerShipDetails & { isSelected?: boolean }>> =>
  createAggregateSelector(selectShips, selectMandateRegisteredOwners, (ships, registeredOwners) => {
    const usedShips = registeredOwners
      .filter((registeredOwner) => registeredOwner.uniqueIdentifier !== registeredOwnerId)
      .map((registeredOwner) => registeredOwner.ships.map((ship) => ship.imoNumber))
      .flat();
    const currentShips = (
      (registeredOwners ?? []).find((registeredOwner) => registeredOwner.uniqueIdentifier === registeredOwnerId)
        ?.ships ?? []
    ).map((ship) => ship.imoNumber);

    const availableShips = ships.filter(
      (ship) =>
        ship.status === TaskItemStatus.COMPLETED &&
        ship?.details?.natureOfReportingResponsibility === 'ISM_COMPANY' &&
        !usedShips.includes(ship?.details?.imoNumber),
    );

    return availableShips.map((ship) => ({
      name: ship?.details?.name,
      imoNumber: ship?.details?.imoNumber,
      isSelected: currentShips.includes(ship?.details?.imoNumber),
    }));
  });

const selectRegisteredOwnerShipDetailByImoNumber = (
  shipImoNumber: ShipDetails['imoNumber'],
): StateSelector<RequestTaskState, RegisteredOwnerShipDetails | null> =>
  createDescendingSelector(selectShips, (ships) => {
    const matchingShip = ships?.find((ship) => ship.details.imoNumber === shipImoNumber);

    return matchingShip
      ? {
          name: matchingShip?.details?.name,
          imoNumber: matchingShip?.details?.imoNumber,
        }
      : null;
  });

const selectIsmShipImoNumbers: StateSelector<
  RequestTaskState,
  Set<ShipDetails['imoNumber']>
> = createDescendingSelector(
  selectShips,
  (ships) =>
    new Set(
      ships
        .filter(
          (ship) =>
            ship?.details?.natureOfReportingResponsibility === 'ISM_COMPANY' &&
            ship.status === TaskItemStatus.COMPLETED,
        )
        .map((ship) => ship?.details?.imoNumber),
    ),
);

export const empCommonQuery = {
  selectPayload,
  selectEmpAttachments,
  selectEmpSectionsCompleted,
  selectStatusForSubtask,
  selectIsSubtaskCompleted,
  selectAbbreviations,
  selectAdditionalDocuments,
  selectAttachedFiles,
  selectTasksDownloadUrl,
  selectManagementProcedures,
  selectOperatorDetails,
  selectControlActivities,
  selectDataGaps,
  selectGreenhouseGas,
  selectEmissionSources,
  selectEmissions,
  selectIsEmpSectionCompleted,
  selectIsShipStatusCompleted,
  selectShips,
  selectShip,
  selectListOfShips,
  selectShipFuelsAndEmissionsFactors,
  selectShipFuelsAndEmissionsFactorsItem,
  selectShipEmissionSources,
  selectShipEmissionSource,
  selectShipUncertaintyLevel,
  selectShipMonitoringMethods,
  selectShipMeasurements,
  selectShipEmissionSourcesNames,
  selectShipCarbonCapture,
  selectExemptionConditions,
  selectIsVariationRegulator,
  selectHasReview,
  selectIsPeerReview,
  selectAnySubtaskNeedsAmend,
  selectShipName,
  selectMandate,
  selectExtendedMandate,
  selectMandateRegisteredOwners,
  selectMandateRegisteredOwnerByUniqueIdentifier,
  selectMandateRegisteredOwnerAvailableShips,
  selectMandateRegisteredOwnersList,
  selectRegisteredOwnerShipDetailByImoNumber,
  selectIsmShipImoNumbers,
};

import { isNil } from 'lodash-es';

import {
  AdditionalDocuments,
  Aer,
  AerDerogations,
  AerFuelConsumption,
  AerMonitoringPlanChanges,
  AerMonitoringPlanVersion,
  AerOperatorDetails,
  AerPort,
  AerPortEmissionsMeasurement,
  AerReportingObligationDetails,
  AerShipAggregatedData,
  AerShipDetails,
  AerShipEmissions,
  AerSmf,
  AerSmfPurchase,
  AerTotalEmissions,
  AerVerificationReport,
  AerVoyage,
  EmissionsSources,
  FuelOriginTypeName,
} from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestTaskQuery,
  RequestTaskState,
  StateSelector,
} from '@netz/common/store';
import { getYearFromRequestId } from '@netz/common/utils';

import { AerCommonTaskPayload, AerVoyageItem } from '@requests/common/aer/aer.types';
import { AER_AGGREGATED_DATA_SUB_TASK } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { AER_PORTS_SUB_TASK } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { AER_TOTAL_EMISSIONS_SUB_TASK } from '@requests/common/aer/subtasks/aer-total-emissions/aer-total-emissions.helpers';
import { AER_VOYAGES_SUB_TASK, getAerJourneyType } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { AER_REDUCTION_CLAIM_SUB_TASK } from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.helpers';
import { REPORTING_OBLIGATION_SUB_TASK } from '@requests/common/aer/subtasks/reporting-obligation/reporting-obligation.helpers';
import { EMISSIONS_SUB_TASK, EMISSIONS_SUB_TASK_PATH } from '@requests/common/components/emissions/emissions.helpers';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { monitoringMethodMap } from '@shared/constants';
import {
  AerAggregatedDataSummaryItemDto,
  AerFuel,
  AerPortSummaryItemDto,
  AerVoyageSummaryItemDto,
  AllFuelOriginTypeName,
  AttachedFile,
  FuelsAndEmissionsFactors,
  ReductionClaimDetailsListItemDto,
  ShipEmissionTableListItem,
} from '@shared/types';

const selectReportingYear: StateSelector<RequestTaskState, string> = createDescendingSelector(
  requestTaskQuery.selectRequestId,
  (requestId) => getYearFromRequestId(requestId),
);

const selectPayload: StateSelector<RequestTaskState, AerCommonTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload,
);

const selectAerAttachments: StateSelector<RequestTaskState, AerCommonTaskPayload['aerAttachments']> =
  createDescendingSelector(selectPayload, (payload) => payload?.aerAttachments);

const selectAttachedFiles = (files?: string[]): StateSelector<RequestTaskState, AttachedFile[]> =>
  createAggregateSelector(
    requestTaskQuery.selectTasksDownloadUrl,
    selectAerAttachments,
    (downloadUrl, aerAttachments) =>
      files?.map((id) => ({
        downloadUrl: downloadUrl + id,
        fileName: aerAttachments?.[id],
      })) ?? [],
  );

const selectAerSectionsCompleted: StateSelector<RequestTaskState, AerCommonTaskPayload['aerSectionsCompleted']> =
  createDescendingSelector(selectPayload, (payload) => payload?.aerSectionsCompleted);

const selectVerificationSectionsCompleted: StateSelector<
  RequestTaskState,
  AerCommonTaskPayload['verificationSectionsCompleted']
> = createDescendingSelector(selectPayload, (payload) => payload?.verificationSectionsCompleted);

const selectStatusForAerSubtask = (
  subtask: keyof Aer | keyof AerVerificationReport | string,
  defaultStatus: TaskItemStatus = TaskItemStatus.NOT_STARTED,
): StateSelector<RequestTaskState, TaskItemStatus> => {
  return createAggregateSelector(
    requestTaskQuery.selectRequestTaskType,
    selectAerSectionsCompleted,
    (requestTaskType, sectionsCompleted) => {
      const taskStatus = sectionsCompleted?.[subtask] as TaskItemStatus;

      return taskStatus ?? defaultStatus;
    },
  );
};

const selectIsSubtaskCompleted = (subtask: keyof Aer | string): StateSelector<RequestTaskState, boolean> => {
  return createDescendingSelector(
    selectStatusForAerSubtask(subtask),
    (status) => (status as TaskItemStatus) === TaskItemStatus.COMPLETED,
  );
};

const selectReportingRequired: StateSelector<RequestTaskState, boolean> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.reportingRequired,
);

const selectReportingObligationDetails: StateSelector<RequestTaskState, AerReportingObligationDetails> =
  createDescendingSelector(selectPayload, (payload) => payload?.reportingObligationDetails);

const selectHasReportingObligation: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  selectIsSubtaskCompleted(REPORTING_OBLIGATION_SUB_TASK),
  selectReportingRequired,
  (isSubtaskCompleted, reportingRequired) => isSubtaskCompleted && reportingRequired === true,
);

const selectAer: StateSelector<RequestTaskState, Aer> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.aer,
);

const selectAerAdditionalDocuments: StateSelector<RequestTaskState, AdditionalDocuments> = createDescendingSelector(
  selectAer,
  (aer) => aer?.additionalDocuments,
);

const selectAerOperatorDetails: StateSelector<RequestTaskState, AerOperatorDetails> = createDescendingSelector(
  selectAer,
  (aer) => aer?.operatorDetails,
);

const selectMonitoringPlanVersion: StateSelector<RequestTaskState, AerMonitoringPlanVersion> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.aerMonitoringPlanVersion,
);

const selectMonitoringPlanChanges: StateSelector<RequestTaskState, AerMonitoringPlanChanges> = createDescendingSelector(
  selectAer,
  (aer) => aer?.aerMonitoringPlanChanges,
);

const selectShips: StateSelector<
  RequestTaskState,
  Array<AerShipEmissions & { status: TaskItemStatus }>
> = createAggregateSelector(selectAer, selectAerSectionsCompleted, (aer, sectionsCompleted) =>
  (aer?.emissions?.ships ?? [])
    .map((ship) => ({
      ...ship,
      status: (sectionsCompleted?.[`${EMISSIONS_SUB_TASK}-ship-${ship.uniqueIdentifier}`] ??
        TaskItemStatus.COMPLETED) as TaskItemStatus,
    }))
    .sort((a, b) => a?.details?.name?.localeCompare(b?.details?.name)),
);

const selectListOfShips: StateSelector<RequestTaskState, Array<ShipEmissionTableListItem>> = createAggregateSelector(
  selectShips,
  selectAerSectionsCompleted,
  (ships, sectionsCompleted) =>
    ships.map((ship) => ({
      uniqueIdentifier: ship.uniqueIdentifier,
      ...ship.details,
      status: (sectionsCompleted?.[`${EMISSIONS_SUB_TASK}-ship-${ship.uniqueIdentifier}`] ??
        TaskItemStatus.COMPLETED) as TaskItemStatus,
    })),
);

const selectShip = (shipId: AerShipEmissions['uniqueIdentifier']): StateSelector<RequestTaskState, AerShipEmissions> =>
  createDescendingSelector(selectShips, (ships) => ships?.find((ship) => ship.uniqueIdentifier === shipId));

const selectShipByImoNumber = (
  imoNumber: AerShipDetails['imoNumber'],
): StateSelector<RequestTaskState, AerShipEmissions> =>
  createDescendingSelector(selectShips, (ships) => ships?.find((ship) => ship?.details?.imoNumber === imoNumber));

const selectShipName = (shipId: AerShipEmissions['uniqueIdentifier']): StateSelector<RequestTaskState, string> =>
  createDescendingSelector(selectShip(shipId), (ship) => {
    return ship?.details?.name;
  });

const selectShipNameByImoNumber = (imoNumber: AerShipDetails['imoNumber']): StateSelector<RequestTaskState, string> =>
  createDescendingSelector(selectShipByImoNumber(imoNumber), (ship) => {
    return ship?.details?.name;
  });

const selectShipFuelsAndEmissionsFactors = (
  shipId: AerShipEmissions['uniqueIdentifier'],
): StateSelector<RequestTaskState, FuelsAndEmissionsFactors[]> =>
  createDescendingSelector(selectShip(shipId), (ship) => ship?.fuelsAndEmissionsFactors ?? []);

const selectShipFuelsAndEmissionsFactorsItem = (
  shipId: AerShipEmissions['uniqueIdentifier'],
  factoryId: FuelsAndEmissionsFactors['uniqueIdentifier'],
): StateSelector<RequestTaskState, FuelsAndEmissionsFactors> =>
  createDescendingSelector(selectShipFuelsAndEmissionsFactors(shipId), (items) =>
    (items ?? []).find((item) => item.uniqueIdentifier === factoryId),
  );

const selectShipEmissionSources = (shipId: AerShipEmissions['uniqueIdentifier']) =>
  createDescendingSelector(selectShip(shipId), (ship) => ship?.emissionsSources ?? []);

const selectShipEmissionSource = (
  shipId: AerShipEmissions['uniqueIdentifier'],
  sourceId: EmissionsSources['uniqueIdentifier'],
) =>
  createDescendingSelector(selectShipEmissionSources(shipId), (sources) =>
    sources.find((source) => source.uniqueIdentifier === sourceId),
  );

const selectShipDerogations = (
  shipId: AerShipEmissions['uniqueIdentifier'],
): StateSelector<RequestTaskState, AerDerogations> =>
  createDescendingSelector(selectShip(shipId), (ship) => ship?.derogations);

const selectShipMonitoringMethods = (shipId: AerShipEmissions['uniqueIdentifier']) =>
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

const selectIsShipStatusCompleted = (
  shipId: AerShipEmissions['uniqueIdentifier'],
): StateSelector<RequestTaskState, boolean> => {
  return createDescendingSelector(
    selectAerSectionsCompleted,
    (completed) => (completed?.[`${EMISSIONS_SUB_TASK}-ship-${shipId}`] as TaskItemStatus) === TaskItemStatus.COMPLETED,
  );
};

const selectPorts: StateSelector<
  RequestTaskState,
  Array<AerPort & { status: TaskItemStatus }>
> = createAggregateSelector(selectPayload, selectShips, (payload, ships) =>
  (payload?.aer?.portEmissions?.ports ?? []).map((port) => {
    const relatedShip = ships.find((x) => x?.details?.imoNumber === port?.imoNumber);

    return {
      ...port,
      status:
        relatedShip?.status !== TaskItemStatus.COMPLETED
          ? TaskItemStatus.NEEDS_REVIEW
          : ((payload?.aerSectionsCompleted?.[`${AER_PORTS_SUB_TASK}-port-call-${port.uniqueIdentifier}`] ??
              TaskItemStatus.IN_PROGRESS) as TaskItemStatus),
    };
  }),
);

const selectPortsList: StateSelector<RequestTaskState, Array<AerPortSummaryItemDto>> = createAggregateSelector(
  selectPorts,
  selectShips,
  selectAerSectionsCompleted,
  (ports, ships, sectionsCompleted) =>
    ports.map<AerPortSummaryItemDto>(
      ({ uniqueIdentifier, imoNumber, portDetails, surrenderEmissions, totalEmissions }: AerPort) => {
        const relatedShip = ships?.find((x) => x?.details?.imoNumber === imoNumber);
        return {
          uniqueIdentifier,
          imoNumber,
          ...portDetails,
          ...portDetails?.visit,
          surrenderEmissions: surrenderEmissions?.total,
          totalEmissions: totalEmissions?.total,
          status:
            relatedShip?.status !== TaskItemStatus.COMPLETED
              ? TaskItemStatus.NEEDS_REVIEW
              : ((sectionsCompleted?.[`ports-port-call-${uniqueIdentifier}`] ??
                  TaskItemStatus.IN_PROGRESS) as TaskItemStatus),
          shipName: relatedShip?.details?.name,
          canViewDetails: relatedShip?.status === TaskItemStatus.COMPLETED,
        };
      },
    ),
);

const selectListOfShipsWithPortCalls: StateSelector<RequestTaskState, ShipEmissionTableListItem[]> =
  createAggregateSelector(selectListOfShips, selectPortsList, (ships, portsList) =>
    (ships ?? []).filter((ship) => portsList.find((portCall) => portCall.imoNumber === ship.imoNumber)),
  );

const selectHasCompletedMinOneShip: StateSelector<RequestTaskState, boolean> = createAggregateSelector(
  selectShips,
  selectAerSectionsCompleted,
  (ships, completed) =>
    ships
      ?.map(
        (ship) =>
          (completed?.[`${EMISSIONS_SUB_TASK}-ship-${ship.uniqueIdentifier}`] ??
            TaskItemStatus.IN_PROGRESS) as TaskItemStatus,
      )
      .includes(TaskItemStatus.COMPLETED),
);

const selectIsPortStatusCompleted = (portId: AerPort['uniqueIdentifier']): StateSelector<RequestTaskState, boolean> => {
  return createDescendingSelector(
    selectAerSectionsCompleted,
    (completed) =>
      (completed?.[`${AER_PORTS_SUB_TASK}-port-call-${portId}`] as TaskItemStatus) === TaskItemStatus.COMPLETED,
  );
};

const selectPort = (portId: AerPort['uniqueIdentifier']): StateSelector<RequestTaskState, AerPort> =>
  createDescendingSelector(selectPorts, (ports) => ports.find((port) => port.uniqueIdentifier === portId));

const selectPortDirectEmissions = (
  portId: AerPort['uniqueIdentifier'],
): StateSelector<RequestTaskState, AerPortEmissionsMeasurement> =>
  createDescendingSelector(selectPort(portId), (port) => port?.directEmissions);

const selectPortFuelConsumption = (
  portId: AerPort['uniqueIdentifier'],
  fuelConsumptionId: AerFuelConsumption['uniqueIdentifier'],
): StateSelector<RequestTaskState, AerFuelConsumption> =>
  createDescendingSelector(selectPort(portId), (port) =>
    port?.fuelConsumptions?.find((fuelConsumption) => fuelConsumption.uniqueIdentifier === fuelConsumptionId),
  );

const selectVoyages: StateSelector<
  RequestTaskState,
  Array<AerVoyageItem & { status: TaskItemStatus }>
> = createAggregateSelector(selectPayload, selectShips, (payload, ships) =>
  (payload?.aer?.voyageEmissions?.voyages ?? []).map((voyage) => {
    const relatedShip = ships.find((x) => x?.details?.imoNumber === voyage?.imoNumber);

    return {
      ...voyage,
      relatedShip,
      status:
        relatedShip?.status !== TaskItemStatus.COMPLETED
          ? TaskItemStatus.NEEDS_REVIEW
          : ((payload?.aerSectionsCompleted?.[`${AER_VOYAGES_SUB_TASK}-voyage-${voyage.uniqueIdentifier}`] ??
              TaskItemStatus.IN_PROGRESS) as TaskItemStatus),
    };
  }),
);

const selectRelatedShipForPort = (
  portId: AerPort['uniqueIdentifier'],
): StateSelector<RequestTaskState, AerShipEmissions> =>
  createAggregateSelector(selectPort(portId), selectShips, (port, ships) =>
    ships?.find((ship) => ship?.details?.imoNumber === port?.imoNumber),
  );

const selectVoyage = (voyageId: AerVoyage['uniqueIdentifier']): StateSelector<RequestTaskState, AerVoyageItem> =>
  createAggregateSelector(selectVoyages, selectShips, (voyages, ships) => {
    const voyage = voyages.find((item) => item.uniqueIdentifier === voyageId);

    return isNil(voyage)
      ? undefined
      : {
          ...voyage,
          relatedShip: ships?.find((ship) => ship?.details?.imoNumber === voyage?.imoNumber),
          journeyType: getAerJourneyType(voyage?.voyageDetails),
        };
  });

const selectVoyageDirectEmissions = (
  voyageId: AerVoyage['uniqueIdentifier'],
): StateSelector<RequestTaskState, AerPortEmissionsMeasurement> =>
  createDescendingSelector(selectVoyage(voyageId), (voyage) => voyage?.directEmissions);

const selectVoyageFuelConsumption = (
  voyageId: AerVoyage['uniqueIdentifier'],
  fuelConsumptionId: AerFuelConsumption['uniqueIdentifier'],
): StateSelector<RequestTaskState, AerFuelConsumption> =>
  createDescendingSelector(selectVoyage(voyageId), (voyage) =>
    voyage?.fuelConsumptions?.find((fuelConsumption) => fuelConsumption.uniqueIdentifier === fuelConsumptionId),
  );

const selectRelatedShipForVoyage = (
  voyageId: AerVoyage['uniqueIdentifier'],
): StateSelector<RequestTaskState, AerShipEmissions> =>
  createAggregateSelector(selectVoyage(voyageId), selectShips, (voyage, ships) =>
    ships?.find((ship) => ship?.details?.imoNumber === voyage?.imoNumber),
  );

const selectVoyagesList: StateSelector<RequestTaskState, Array<AerVoyageSummaryItemDto>> = createAggregateSelector(
  selectVoyages,
  selectShips,
  selectAerSectionsCompleted,
  (voyages, ships, sectionsCompleted) =>
    voyages.map<AerVoyageSummaryItemDto>(
      ({ uniqueIdentifier, imoNumber, voyageDetails, surrenderEmissions, totalEmissions }: AerVoyage) => {
        const relatedShip = ships?.find((x) => x?.details?.imoNumber === imoNumber);
        return {
          uniqueIdentifier,
          imoNumber,
          ...voyageDetails,
          arrivalPort: voyageDetails?.arrivalPort?.port,
          arrivalCountry: voyageDetails?.arrivalPort?.country,
          departurePort: voyageDetails?.departurePort?.port,
          departureCountry: voyageDetails?.departurePort?.country,
          surrenderEmissions: surrenderEmissions?.total,
          totalEmissions: totalEmissions?.total,
          status:
            relatedShip?.status !== TaskItemStatus.COMPLETED
              ? TaskItemStatus.NEEDS_REVIEW
              : ((sectionsCompleted?.[`${AER_VOYAGES_SUB_TASK}-voyage-${uniqueIdentifier}`] ??
                  TaskItemStatus.IN_PROGRESS) as TaskItemStatus),
          shipName: relatedShip?.details?.name,
          canViewDetails: relatedShip?.status === TaskItemStatus.COMPLETED,
        };
      },
    ),
);

const selectListOfShipsWithVoyages: StateSelector<RequestTaskState, ShipEmissionTableListItem[]> =
  createAggregateSelector(selectListOfShips, selectVoyagesList, (ships, voyagesList) =>
    (ships ?? []).filter((ship) => voyagesList.find((voyage) => voyage.imoNumber === ship.imoNumber)),
  );

const selectIsVoyageStatusCompleted = (
  voyageId: AerVoyage['uniqueIdentifier'],
): StateSelector<RequestTaskState, boolean> => {
  return createDescendingSelector(
    selectAerSectionsCompleted,
    (completed) =>
      (completed?.[`${AER_PORTS_SUB_TASK}-voyage-${voyageId}`] as TaskItemStatus) === TaskItemStatus.COMPLETED,
  );
};

const selectAllAggregatedData: StateSelector<
  RequestTaskState,
  Array<
    AerShipAggregatedData & {
      status: TaskItemStatus;
      relatedShip: AerShipEmissions & { status: TaskItemStatus };
      relatedPorts?: AerPortSummaryItemDto[];
      relatedVoyages?: AerVoyageSummaryItemDto[];
    }
  >
> = createAggregateSelector(
  selectPayload,
  selectShips,
  createAggregateSelector(selectPortsList, selectVoyagesList, (ports, voyages) => ({ ports, voyages })),
  (payload, ships, { ports, voyages }) => {
    return (payload?.aer?.aggregatedData?.emissions ?? []).map((data) => {
      const relatedShip = ships?.find((x) => x?.details?.imoNumber === data.imoNumber);
      const relatedPorts = ports.filter((port) => port.imoNumber === data.imoNumber);
      const relatedVoyages = voyages.filter((voyage) => voyage.imoNumber === data.imoNumber);

      return {
        ...data,
        relatedShip,
        relatedPorts: data?.fromFetch ? relatedPorts : undefined,
        relatedVoyages: data?.fromFetch ? relatedVoyages : undefined,
        status:
          relatedShip?.status !== TaskItemStatus.COMPLETED
            ? TaskItemStatus.NEEDS_REVIEW
            : ((payload?.aerSectionsCompleted?.[
                `${AER_AGGREGATED_DATA_SUB_TASK}-aggregated-data-${data.uniqueIdentifier}`
              ] ?? TaskItemStatus.IN_PROGRESS) as TaskItemStatus),
      };
    });
  },
);

const selectAggregatedDataList: StateSelector<
  RequestTaskState,
  Array<AerAggregatedDataSummaryItemDto>
> = createDescendingSelector(selectAllAggregatedData, (payload) =>
  (payload ?? []).map((data) => ({
    uniqueIdentifier: data.uniqueIdentifier,
    imoNumber: data?.imoNumber,
    surrenderEmissions: data?.surrenderEmissions,
    totalShipEmissions: data?.totalShipEmissions,
    shipName: data?.relatedShip?.details?.name,
    status: data?.status,
    canViewDetails: data.relatedShip?.status === TaskItemStatus.COMPLETED,
  })),
);

const selectAggregatedDataItem = (
  dataId: AerShipAggregatedData['uniqueIdentifier'],
): StateSelector<
  RequestTaskState,
  AerShipAggregatedData & {
    status: TaskItemStatus;
    relatedShip: AerShipEmissions & { status: TaskItemStatus };
    relatedPorts?: AerPortSummaryItemDto[];
    relatedVoyages?: AerVoyageSummaryItemDto[];
  }
> =>
  createDescendingSelector(selectAllAggregatedData, (payload) =>
    payload?.find((data) => data.uniqueIdentifier === dataId),
  );

const selectRelatedShipForAggregatedData = (
  dataId: AerShipAggregatedData['uniqueIdentifier'],
): StateSelector<RequestTaskState, AerShipEmissions> =>
  createAggregateSelector(selectAggregatedDataItem(dataId), selectShips, (aggregatedData, ships) =>
    ships.find((x) => x?.details?.imoNumber === aggregatedData?.imoNumber),
  );

const selectListOfShipsWithAggregatedData: StateSelector<RequestTaskState, ShipEmissionTableListItem[]> =
  createAggregateSelector(selectListOfShips, selectAllAggregatedData, (ships, allAggregatedData) =>
    (ships ?? []).filter((ship) => allAggregatedData.find((dataItem) => dataItem.imoNumber === ship.imoNumber)),
  );

const selectListOfShipsWithoutAggregatedData = (
  objectId: string,
): StateSelector<RequestTaskState, ShipEmissionTableListItem[]> =>
  createAggregateSelector(
    selectListOfShips,
    selectAllAggregatedData,
    selectAggregatedDataItem(objectId),
    (ships, allAggregatedData, currentAggregatedDataItem) =>
      (ships ?? []).filter(
        (ship) =>
          ship.imoNumber === currentAggregatedDataItem?.imoNumber ||
          !allAggregatedData.find((dataItem) => dataItem.imoNumber === ship.imoNumber),
      ),
  );

const itemsSelectorMap: Record<
  'ports' | 'voyages' | 'aggregatedData',
  StateSelector<RequestTaskState, Array<{ uniqueIdentifier: string; status: TaskItemStatus }>>
> = {
  ports: selectPortsList,
  voyages: selectVoyagesList,
  aggregatedData: selectAggregatedDataList,
};

const selectStatusForAerSubtaskWithEmissionsRelation = (
  subtask: typeof AER_PORTS_SUB_TASK | typeof AER_VOYAGES_SUB_TASK | typeof AER_AGGREGATED_DATA_SUB_TASK,
  initialStatus: TaskItemStatus = TaskItemStatus.OPTIONAL,
): StateSelector<RequestTaskState, TaskItemStatus> => {
  return createAggregateSelector(
    selectStatusForAerSubtask(subtask, null),
    selectHasCompletedMinOneShip,
    itemsSelectorMap[subtask],
    (subtaskStatus, hasCompletedShips, list) => {
      return isNil(subtaskStatus) && !hasCompletedShips
        ? TaskItemStatus.CANNOT_START_YET
        : isNil(subtaskStatus) && hasCompletedShips
          ? initialStatus
          : list.find((x) => x.status === TaskItemStatus.NEEDS_REVIEW)
            ? TaskItemStatus.NEEDS_REVIEW
            : subtaskStatus;
    },
  );
};

const selectStatusForPortsSubtask = selectStatusForAerSubtaskWithEmissionsRelation(AER_PORTS_SUB_TASK);
const selectStatusForVoyagesSubtask = selectStatusForAerSubtaskWithEmissionsRelation(AER_VOYAGES_SUB_TASK);
const selectStatusForAggregatedDataSubtask = selectStatusForAerSubtaskWithEmissionsRelation(
  AER_AGGREGATED_DATA_SUB_TASK,
  TaskItemStatus.NOT_STARTED,
);

const selectStatusForReductionClaim = createAggregateSelector(
  selectStatusForAerSubtask(EMISSIONS_SUB_TASK_PATH),
  selectStatusForAerSubtask(AER_REDUCTION_CLAIM_SUB_TASK),
  (emissionsSubtaskStatus, reductionClaimSubtaskStatus) =>
    emissionsSubtaskStatus === TaskItemStatus.COMPLETED ? reductionClaimSubtaskStatus : TaskItemStatus.CANNOT_START_YET,
);

const selectReductionClaim: StateSelector<RequestTaskState, AerSmf> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.aer?.smf,
);

const selectReductionClaimFuelPurchases: StateSelector<
  RequestTaskState,
  Array<AerSmfPurchase>
> = createDescendingSelector(selectReductionClaim, (payload) => payload?.smfDetails?.purchases ?? []);

const selectReductionClaimFuelPurchase = (fuelPurchaseId: string): StateSelector<RequestTaskState, AerSmfPurchase> =>
  createDescendingSelector(selectReductionClaimFuelPurchases, (payload) =>
    payload?.find((purchase) => purchase?.uniqueIdentifier === fuelPurchaseId),
  );

const selectSupersetOfFuelTypes: StateSelector<RequestTaskState, Array<FuelOriginTypeName>> = createDescendingSelector(
  selectShips,
  (ships) => ships.map((ship) => ship.fuelsAndEmissionsFactors).flat(),
);

const selectReductionClaimDetailsListItems: StateSelector<
  RequestTaskState,
  Array<ReductionClaimDetailsListItemDto>
> = createAggregateSelector(
  requestTaskQuery.selectTasksDownloadUrl,
  selectAerAttachments,
  selectReductionClaim,
  (downloadUrl, attachments, smf) =>
    [
      ...(smf?.smfDetails?.purchases ?? []).map((purchase) => ({
        ...purchase,
        evidenceFiles: purchase.evidenceFiles?.map((file) => ({
          downloadUrl: downloadUrl + file,
          fileName: attachments?.[file],
        })),
      })),
      smf?.smfDetails?.purchases?.length
        ? { isSummary: true, co2Emissions: smf?.smfDetails?.totalSustainableEmissions }
        : undefined,
    ].filter(Boolean),
);

const selectStatusForTotalEmissions: StateSelector<RequestTaskState, TaskItemStatus> = createAggregateSelector(
  selectStatusForAggregatedDataSubtask,
  selectStatusForReductionClaim,
  selectStatusForAerSubtask(AER_TOTAL_EMISSIONS_SUB_TASK),
  (aggregatedDataSubtaskStatus, reductionClaimSubtaskStatus, totalEmissionsSubtaskStatus) =>
    aggregatedDataSubtaskStatus === TaskItemStatus.COMPLETED && reductionClaimSubtaskStatus === TaskItemStatus.COMPLETED
      ? totalEmissionsSubtaskStatus
      : TaskItemStatus.CANNOT_START_YET,
);

const selectTotalEmissions: StateSelector<RequestTaskState, AerTotalEmissions> = createDescendingSelector(
  selectAer,
  (aer) => aer?.totalEmissions,
);

const selectVoyageEmissions: StateSelector<RequestTaskState, AerVoyage[]> = createDescendingSelector(
  selectAer,
  (aer) => aer?.voyageEmissions?.voyages ?? [],
);

const selectPortEmissions: StateSelector<RequestTaskState, AerPort[]> = createDescendingSelector(
  selectAer,
  (aer) => aer?.portEmissions?.ports ?? [],
);

const selectShipFuelsAndEmissionsFactorsByImoNumber = (
  imoNumber: AerShipDetails['imoNumber'],
): StateSelector<RequestTaskState, AerFuel[]> =>
  createDescendingSelector(
    selectShipByImoNumber(imoNumber),
    (ship) => (ship?.fuelsAndEmissionsFactors as AerFuel[]) ?? [],
  );

const selectShipEmissionSourcesByImoNumber = (
  imoNumber: AerShipDetails['imoNumber'],
): StateSelector<RequestTaskState, EmissionsSources[]> =>
  createDescendingSelector(selectShipByImoNumber(imoNumber), (ship) => ship?.emissionsSources ?? []);

const selectShipEmissionSourceByName = (
  imoNumber: AerShipDetails['imoNumber'],
  emissionSourceName: EmissionsSources['name'],
): StateSelector<RequestTaskState, EmissionsSources> =>
  createDescendingSelector(selectShipEmissionSourcesByImoNumber(imoNumber), (emissionSources) => {
    return emissionSources?.find((item) => item.name?.toUpperCase() === emissionSourceName?.toUpperCase());
  });

/**
 * Match specific fuel origin/fuel type/emissionSourceName/methaneSlip combination related to a ship's IMO number but based on emissionSources.
 * If emissionSourceName is provided, it will try to match fuelDetails from that specific EmissionSources
 */
const selectShipFuelOriginMethaneCombination = (
  imoNumber: AerShipDetails['imoNumber'],
  origin: AllFuelOriginTypeName['origin'],
  type: AllFuelOriginTypeName['type'],
  emissionSourceName?: EmissionsSources['name'],
  methaneSlip?: AllFuelOriginTypeName['methaneSlip'],
): StateSelector<RequestTaskState, AllFuelOriginTypeName> =>
  createDescendingSelector(selectShipEmissionSourcesByImoNumber(imoNumber), (emissionSources) => {
    const currentFuelDetails = isNil(emissionSourceName)
      ? (emissionSources?.flatMap((item) => item?.fuelDetails) as AllFuelOriginTypeName[])
      : (emissionSources?.find((item) => item.name?.toUpperCase() === emissionSourceName?.toUpperCase())
          ?.fuelDetails as AllFuelOriginTypeName[]);

    return currentFuelDetails?.find((fuelDetail) => {
      const methaneSlipFound = isNil(methaneSlip) ? true : fuelDetail?.methaneSlip === methaneSlip;
      return fuelDetail?.origin === origin && fuelDetail?.type === type && methaneSlipFound;
    });
  });

const selectShipFuelOriginTypeCombination = (
  imoNumber: AerShipDetails['imoNumber'],
  origin: AllFuelOriginTypeName['origin'],
  type: AllFuelOriginTypeName['type'],
): StateSelector<RequestTaskState, AerFuel> =>
  createDescendingSelector(selectShipFuelsAndEmissionsFactorsByImoNumber(imoNumber), (items) =>
    (items ?? []).find((item) => item.origin === origin && item.type === type),
  );

const selectShipFuelOriginTypeNameCombination = (
  imoNumber: AerShipDetails['imoNumber'],
  name: AllFuelOriginTypeName['name'],
  origin: AllFuelOriginTypeName['origin'],
  type: AllFuelOriginTypeName['type'],
): StateSelector<RequestTaskState, AerFuel> =>
  createDescendingSelector(selectShipFuelsAndEmissionsFactorsByImoNumber(imoNumber), (items) =>
    (items ?? []).find((item) => item.origin === origin && item.type === type && item.name === name),
  );

export const aerCommonQuery = {
  selectReportingYear,
  selectPayload,
  selectAerAttachments,
  selectAttachedFiles,
  selectAerSectionsCompleted,
  selectVerificationSectionsCompleted,
  selectStatusForAerSubtask,
  selectIsSubtaskCompleted,
  selectReportingRequired,
  selectReportingObligationDetails,
  selectHasReportingObligation,
  selectAer,
  selectAerOperatorDetails,
  selectMonitoringPlanVersion,
  selectMonitoringPlanChanges,
  selectAerAdditionalDocuments,
  selectShips,
  selectListOfShips,
  selectShip,
  selectShipByImoNumber,
  selectShipName,
  selectShipNameByImoNumber,
  selectShipDerogations,
  selectShipFuelsAndEmissionsFactors,
  selectShipFuelsAndEmissionsFactorsItem,
  selectShipEmissionSources,
  selectShipEmissionSource,
  selectShipMonitoringMethods,
  selectIsShipStatusCompleted,
  selectStatusForPortsSubtask,
  selectPorts,
  selectPort,
  selectPortDirectEmissions,
  selectPortFuelConsumption,
  selectRelatedShipForPort,
  selectPortsList,
  selectListOfShipsWithPortCalls,
  selectIsPortStatusCompleted,
  selectStatusForVoyagesSubtask,
  selectVoyages,
  selectVoyagesList,
  selectListOfShipsWithVoyages,
  selectVoyage,
  selectVoyageDirectEmissions,
  selectVoyageFuelConsumption,
  selectRelatedShipForVoyage,
  selectIsVoyageStatusCompleted,
  selectStatusForAggregatedDataSubtask,
  selectAllAggregatedData,
  selectAggregatedDataList,
  selectAggregatedDataItem,
  selectRelatedShipForAggregatedData,
  selectListOfShipsWithAggregatedData,
  selectListOfShipsWithoutAggregatedData,
  selectStatusForReductionClaim,
  selectReductionClaim,
  selectReductionClaimFuelPurchases,
  selectReductionClaimFuelPurchase,
  selectSupersetOfFuelTypes,
  selectReductionClaimDetailsListItems,
  selectStatusForTotalEmissions,
  selectTotalEmissions,
  selectVoyageEmissions,
  selectPortEmissions,
  selectShipEmissionSourceByName,
  selectShipFuelOriginMethaneCombination,
  selectShipFuelOriginTypeCombination,
  selectShipFuelOriginTypeNameCombination,
};

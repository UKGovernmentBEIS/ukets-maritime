import {
  AdditionalDocuments,
  EmissionsMonitoringPlan,
  EmpAbbreviations,
  EmpAcceptedVariationDecisionDetails,
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
  EmpVariationApplicationApprovedRequestActionPayload,
  EmpVariationApplicationRegulatorLedApprovedRequestActionPayload,
  EmpVariationDetails,
  EmpVariationRegulatorLedReason,
} from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestActionQuery,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { TaskItemStatus, timelineCommonQuery, timelineUtils } from '@requests/common';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import {
  AttachedFile,
  EmpVariationReviewDecisionDto,
  EmpVariationReviewDecisionUnion,
  ShipEmissionTableListItem,
} from '@shared/types';

const selectPayload: StateSelector<
  RequestActionState,
  EmpVariationApplicationRegulatorLedApprovedRequestActionPayload & EmpVariationApplicationApprovedRequestActionPayload
> = timelineCommonQuery.selectPayload<
  EmpVariationApplicationRegulatorLedApprovedRequestActionPayload & EmpVariationApplicationApprovedRequestActionPayload
>();

const selectIsVariationRegulator: StateSelector<RequestActionState, boolean> = createDescendingSelector(
  requestActionQuery.selectActionType,
  (requestTaskType) => requestTaskType === 'EMP_VARIATION_APPLICATION_REGULATOR_LED_APPROVED',
);

const selectEmpVariationDetails: StateSelector<RequestActionState, EmpVariationDetails> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.empVariationDetails,
);

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

const selectMandate: StateSelector<RequestActionState, EmpMandate> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.emissionsMonitoringPlan?.mandate,
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

const selectEmpSectionsCompleted: StateSelector<
  RequestActionState,
  EmpIssuanceApplicationSubmittedRequestActionPayload['empSectionsCompleted']
> = createDescendingSelector(selectPayload, (payload) => payload?.empSectionsCompleted);

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

const selectReviewAttachments: StateSelector<
  RequestActionState,
  EmpVariationApplicationApprovedRequestActionPayload['reviewAttachments']
> = createDescendingSelector(selectPayload, (payload) => payload?.reviewAttachments);

const selectReviewGroupDecision = (
  subtask: keyof EmissionsMonitoringPlan,
): StateSelector<RequestActionState, EmpVariationReviewDecisionDto | null> =>
  createAggregateSelector(
    selectPayload,
    selectReviewAttachments,
    timelineCommonQuery.selectDownloadUrl,
    (payload, reviewAttachments, downloadUrl) => {
      const group = subtaskReviewGroupMap[subtask];
      const reviewGroupDecision = payload?.reviewGroupDecisions?.[group] as EmpVariationReviewDecisionUnion;

      return !reviewGroupDecision
        ? null
        : {
            type: reviewGroupDecision.type,
            details: {
              requiredChanges: reviewGroupDecision?.details?.requiredChanges?.map((change) => ({
                reason: change?.reason,
                files:
                  change?.files?.map((id) => ({
                    downloadUrl: downloadUrl + `${id}`,
                    fileName: reviewAttachments[id],
                  })) ?? [],
              })),
              variationScheduleItems: reviewGroupDecision?.details?.variationScheduleItems,
              notes: reviewGroupDecision?.details?.notes,
            },
          };
    },
  );

const selectEmpVariationDetailsReviewDecisionDTO: StateSelector<
  RequestActionState,
  EmpVariationReviewDecisionDto | null
> = createAggregateSelector(
  selectPayload,
  selectReviewAttachments,
  timelineCommonQuery.selectDownloadUrl,
  (payload, reviewAttachments, downloadUrl) => {
    const reviewDecision = payload?.empVariationDetailsReviewDecision as EmpVariationReviewDecisionUnion;

    return !reviewDecision
      ? null
      : {
          type: reviewDecision?.type,
          details: {
            requiredChanges: reviewDecision?.details?.requiredChanges?.map((change) => ({
              reason: change?.reason,
              files:
                change?.files?.map((id) => ({
                  downloadUrl: downloadUrl + `${id}`,
                  fileName: reviewAttachments[id],
                })) ?? [],
            })),
            variationScheduleItems: reviewDecision?.details?.variationScheduleItems,
            notes: reviewDecision?.details?.notes,
          },
        };
  },
);

const selectReasonRegulatorLed: StateSelector<RequestActionState, EmpVariationRegulatorLedReason> =
  createDescendingSelector(selectPayload, (payload) => payload?.reasonRegulatorLed);

const selectVariationRegulatorDecisionDetails = (
  subtask: keyof EmissionsMonitoringPlan,
): StateSelector<RequestActionState, EmpAcceptedVariationDecisionDetails> => {
  return createDescendingSelector(selectPayload, (payload) => {
    const group = subtaskReviewGroupMap[subtask];
    return payload?.reviewGroupDecisions?.[group];
  });
};

export const empVariationSubmittedQuery = {
  selectIsVariationRegulator,
  selectEmpVariationDetails,
  selectAttachedFiles,
  selectOperatorDetails,
  selectDataGaps,
  selectMandate,
  selectAdditionalDocuments,
  selectAbbreviations,
  selectManagementProcedures,
  selectControlActivities,
  selectGreenhouseGas,
  selectEmissionSources,
  selectShip,
  selectListOfShips,
  selectReviewGroupDecision,
  selectEmpVariationDetailsReviewDecisionDTO,
  selectReasonRegulatorLed,
  selectVariationRegulatorDecisionDetails,
};

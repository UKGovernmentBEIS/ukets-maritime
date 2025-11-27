import { isNil } from 'lodash-es';

import {
  AdditionalDocuments,
  AerApplicationAmendsSubmitRequestTaskPayload,
  AerApplicationSubmittedRequestActionPayload,
  AerApplicationVerificationSubmittedRequestActionPayload,
  AerComplianceMonitoringReporting,
  AerDataGapsMethodologies,
  AerDataReviewDecision,
  AerEmissions,
  AerEmissionsReductionClaimVerification,
  AerEtsComplianceRules,
  AerMaterialityLevel,
  AerMonitoringPlanChanges,
  AerMonitoringPlanVersion,
  AerOperatorDetails,
  AerOpinionStatement,
  AerPort,
  AerRecommendedImprovements,
  AerReportingObligationDetails,
  AerSaveReviewGroupDecisionRequestTaskActionPayload,
  AerShipAggregatedData,
  AerShipEmissions,
  AerSmf,
  AerTotalEmissions,
  AerUncorrectedMisstatements,
  AerUncorrectedNonCompliances,
  AerUncorrectedNonConformities,
  AerVerificationDecision,
  AerVerificationReport,
  AerVoyage,
} from '@mrtm/api';

import {
  createAggregateSelector,
  createDescendingSelector,
  requestActionQuery,
  RequestActionState,
  StateSelector,
} from '@netz/common/store';

import { TaskItemStatus, timelineCommonQuery, timelineUtils } from '@requests/common';
import { AerVerifierDetails } from '@requests/common/aer/aer.types';
import { getAerJourneyType } from '@requests/common/aer/subtasks/aer-voyages';
import {
  AerAggregatedDataSummaryItemDto,
  AerJourneyTypeEnum,
  AerPortSummaryItemDto,
  AerVoyageSummaryItemDto,
  AttachedFile,
  ReductionClaimDetailsListItemDto,
  ReviewDecisionDto,
  ReviewDecisionUnion,
  ShipEmissionTableListItem,
} from '@shared/types';

const selectPayload: StateSelector<
  RequestActionState,
  (AerApplicationSubmittedRequestActionPayload | AerApplicationVerificationSubmittedRequestActionPayload) &
    AerApplicationAmendsSubmitRequestTaskPayload
> = timelineCommonQuery.selectPayload<
  (AerApplicationSubmittedRequestActionPayload | AerApplicationVerificationSubmittedRequestActionPayload) &
    AerApplicationAmendsSubmitRequestTaskPayload
>();

const selectAer: StateSelector<
  RequestActionState,
  ((AerApplicationSubmittedRequestActionPayload | AerApplicationVerificationSubmittedRequestActionPayload) &
    AerApplicationAmendsSubmitRequestTaskPayload)['aer']
> = createDescendingSelector(selectPayload, (payload) => payload?.aer);

const selectAerAttachments: StateSelector<
  RequestActionState,
  AerApplicationSubmittedRequestActionPayload['aerAttachments']
> = createDescendingSelector(selectPayload, (payload) => payload?.aerAttachments);

const selectAttachedFiles = (files?: Array<string>): StateSelector<RequestActionState, AttachedFile[]> =>
  createAggregateSelector(timelineCommonQuery.selectDownloadUrl, selectPayload, (downloadUrl, payload) =>
    timelineUtils.getAttachedFiles(files, payload?.aerAttachments, downloadUrl),
  );

const selectReportingRequired: StateSelector<RequestActionState, boolean> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.reportingRequired,
);

const selectReportingObligationDetails: StateSelector<RequestActionState, AerReportingObligationDetails> =
  createDescendingSelector(selectPayload, (payload) => payload?.reportingObligationDetails);

const selectAdditionalDocuments: StateSelector<RequestActionState, AdditionalDocuments> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.aer?.additionalDocuments,
);

const selectOperatorDetails: StateSelector<RequestActionState, AerOperatorDetails> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.aer?.operatorDetails,
);

const selectMonitoringPlanVersion: StateSelector<RequestActionState, AerMonitoringPlanVersion> =
  createDescendingSelector(selectPayload, (payload) => payload?.aerMonitoringPlanVersion);

const selectMonitoringPlanChanges: StateSelector<RequestActionState, AerMonitoringPlanChanges> =
  createDescendingSelector(selectPayload, (payload) => payload?.aer?.aerMonitoringPlanChanges);

const selectEmissions: StateSelector<RequestActionState, AerEmissions> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.aer?.emissions,
);

const selectShips: StateSelector<RequestActionState, AerShipEmissions[]> = createDescendingSelector(
  selectEmissions,
  (payload) => payload?.ships ?? [],
);

const selectListOfShips: StateSelector<RequestActionState, ShipEmissionTableListItem[]> = createDescendingSelector(
  selectShips,
  (ships) =>
    ships.map((x) => ({
      uniqueIdentifier: x.uniqueIdentifier,
      ...x.details,
      status: TaskItemStatus.COMPLETED,
    })),
);

const selectShip = (
  shipId: AerShipEmissions['uniqueIdentifier'],
): StateSelector<RequestActionState, AerShipEmissions> =>
  createDescendingSelector(selectShips, (ships) => ships?.find((ship) => ship.uniqueIdentifier === shipId));

const selectVoyages: StateSelector<RequestActionState, Array<AerVoyage>> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.aer?.voyageEmissions?.voyages ?? [],
);

const selectVoyagesList: StateSelector<RequestActionState, Array<AerVoyageSummaryItemDto>> = createAggregateSelector(
  selectVoyages,
  selectShips,
  (voyages, ships) =>
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
          status: TaskItemStatus.COMPLETED,
          shipName: relatedShip?.details?.name,
          journeyType: getAerJourneyType(voyageDetails),
          canViewDetails: true,
        };
      },
    ),
);

const selectVoyage = (
  voyageId: AerVoyage['uniqueIdentifier'],
): StateSelector<RequestActionState, AerVoyage & { journeyType?: AerJourneyTypeEnum }> =>
  createDescendingSelector(selectVoyages, (voyages) => {
    const voyage = voyages.find((item) => item.uniqueIdentifier === voyageId);

    return isNil(voyage)
      ? undefined
      : {
          ...voyage,
          journeyType: getAerJourneyType(voyage?.voyageDetails),
        };
  });

const selectRelatedShipForVoyage = (
  voyageId: AerVoyage['uniqueIdentifier'],
): StateSelector<RequestActionState, AerShipEmissions> =>
  createAggregateSelector(selectVoyage(voyageId), selectShips, (voyage, ships) =>
    ships?.find((ship) => ship?.details?.imoNumber === voyage?.imoNumber),
  );

const selectPorts: StateSelector<
  RequestActionState,
  Array<AerPort & { status: TaskItemStatus }>
> = createDescendingSelector(selectPayload, (payload) =>
  (payload?.aer?.portEmissions?.ports ?? []).map((port) => ({ ...port, status: TaskItemStatus.COMPLETED })),
);

const selectPortsList: StateSelector<RequestActionState, Array<AerPortSummaryItemDto>> = createAggregateSelector(
  selectPorts,
  selectShips,
  (ports, ships) =>
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
          status: TaskItemStatus.COMPLETED,
          shipName: relatedShip?.details?.name,
          canViewDetails: true,
        };
      },
    ),
);

const selectPort = (portId: AerPort['uniqueIdentifier']): StateSelector<RequestActionState, AerPort> =>
  createDescendingSelector(selectPorts, (ports) => ports.find((port) => port.uniqueIdentifier === portId));

const selectAllAggregatedData: StateSelector<
  RequestActionState,
  Array<AerShipAggregatedData & { relatedShip: AerShipEmissions }>
> = createAggregateSelector(selectPayload, selectShips, (payload, ships) =>
  (payload?.aer?.aggregatedData?.emissions ?? []).map((data) => {
    return { ...data, relatedShip: ships?.find((x) => x?.details?.imoNumber === data.imoNumber) };
  }),
);

const selectAggregatedDataList: StateSelector<
  RequestActionState,
  Array<AerAggregatedDataSummaryItemDto>
> = createDescendingSelector(selectAllAggregatedData, (payload) =>
  (payload ?? []).map((data) => ({
    uniqueIdentifier: data.uniqueIdentifier,
    imoNumber: data?.imoNumber,
    surrenderEmissions: data?.surrenderEmissions,
    totalShipEmissions: data?.totalShipEmissions,
    shipName: data?.relatedShip?.details?.name,
    status: TaskItemStatus.COMPLETED,
    canViewDetails: true,
  })),
);

const selectAggregatedDataItem = (
  dataId: AerShipAggregatedData['uniqueIdentifier'],
): StateSelector<RequestActionState, AerShipAggregatedData> =>
  createDescendingSelector(selectAllAggregatedData, (payload) =>
    payload?.find((data) => data.uniqueIdentifier === dataId),
  );

const selectRelatedShipForAggregatedData = (
  dataId: AerShipAggregatedData['uniqueIdentifier'],
): StateSelector<RequestActionState, AerShipEmissions> =>
  createAggregateSelector(selectAggregatedDataItem(dataId), selectShips, (aggregatedData, ships) =>
    ships.find((x) => x?.details?.imoNumber === aggregatedData?.imoNumber),
  );

const selectReductionClaim: StateSelector<RequestActionState, AerSmf> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.aer?.smf,
);

const selectRelatedShipForPort = (
  portId: AerPort['uniqueIdentifier'],
): StateSelector<RequestActionState, AerShipEmissions> =>
  createAggregateSelector(selectPort(portId), selectShips, (port, ships) =>
    ships?.find((ship) => ship?.details?.imoNumber === port?.imoNumber),
  );

const selectReductionClaimDetailsListItems: StateSelector<
  RequestActionState,
  Array<ReductionClaimDetailsListItemDto>
> = createAggregateSelector(
  timelineCommonQuery.selectDownloadUrl,
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

const selectTotalEmissions: StateSelector<RequestActionState, AerTotalEmissions> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.aer?.totalEmissions,
);

const selectVerificationReport: StateSelector<RequestActionState, AerVerificationReport> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.verificationReport,
);

const selectVerifierDetails: StateSelector<RequestActionState, AerVerifierDetails> = createDescendingSelector(
  selectVerificationReport,
  (verificationReport) => ({
    verificationBodyId: verificationReport?.verificationBodyId,
    verificationBodyDetails: verificationReport?.verificationBodyDetails,
    verifierContact: verificationReport?.verifierContact,
    verificationTeamDetails: verificationReport?.verificationTeamDetails,
  }),
);

const selectOpinionStatement: StateSelector<RequestActionState, AerOpinionStatement> = createDescendingSelector(
  selectVerificationReport,
  (verificationReport) => verificationReport?.opinionStatement,
);

const selectEtsComplianceRules: StateSelector<RequestActionState, AerEtsComplianceRules> = createDescendingSelector(
  selectVerificationReport,
  (verificationReport) => verificationReport?.etsComplianceRules,
);

const selectComplianceMonitoringReporting: StateSelector<RequestActionState, AerComplianceMonitoringReporting> =
  createDescendingSelector(
    selectVerificationReport,
    (verificationReport) => verificationReport?.complianceMonitoringReporting,
  );

const selectOverallVerificationDecision: StateSelector<RequestActionState, AerVerificationDecision> =
  createDescendingSelector(selectVerificationReport, (verificationReport) => verificationReport?.overallDecision);

const selectUncorrectedMisstatements: StateSelector<RequestActionState, AerUncorrectedMisstatements> =
  createDescendingSelector(
    selectVerificationReport,
    (verificationReport) => verificationReport?.uncorrectedMisstatements,
  );

const selectUncorrectedNonConformities: StateSelector<RequestActionState, AerUncorrectedNonConformities> =
  createDescendingSelector(
    selectVerificationReport,
    (verificationReport) => verificationReport?.uncorrectedNonConformities,
  );

const selectUncorrectedNonCompliances: StateSelector<RequestActionState, AerUncorrectedNonCompliances> =
  createDescendingSelector(
    selectVerificationReport,
    (verificationReport) => verificationReport?.uncorrectedNonCompliances,
  );

const selectRecommendedImprovements: StateSelector<RequestActionState, AerRecommendedImprovements> =
  createDescendingSelector(
    selectVerificationReport,
    (verificationReport) => verificationReport?.recommendedImprovements,
  );

const selectDataGapsMethodologies: StateSelector<RequestActionState, AerDataGapsMethodologies> =
  createDescendingSelector(selectVerificationReport, (verificationReport) => verificationReport?.dataGapsMethodologies);

const selectMaterialityLevel: StateSelector<RequestActionState, AerMaterialityLevel> = createDescendingSelector(
  selectVerificationReport,
  (verificationReport) => verificationReport?.materialityLevel,
);

const selectEmissionsReductionClaimVerification: StateSelector<
  RequestActionState,
  AerEmissionsReductionClaimVerification
> = createDescendingSelector(
  selectVerificationReport,
  (verificationReport) => verificationReport?.emissionsReductionClaimVerification,
);

const isReviewCompletedActionType: StateSelector<RequestActionState, boolean> = createDescendingSelector(
  requestActionQuery.selectActionType,
  (actionType) => actionType === 'AER_APPLICATION_COMPLETED',
);

const selectReviewAttachments: StateSelector<
  RequestActionState,
  AerApplicationAmendsSubmitRequestTaskPayload['reviewAttachments']
> = createDescendingSelector(selectPayload, (payload) => payload?.reviewAttachments);

const selectReviewGroupDecisions: StateSelector<RequestActionState, { [key: string]: ReviewDecisionUnion }> =
  createDescendingSelector(
    selectPayload,
    (payload) => payload.reviewGroupDecisions as { [key: string]: ReviewDecisionUnion },
  );

const selectReviewGroupDecision = (
  group: AerSaveReviewGroupDecisionRequestTaskActionPayload['group'],
): StateSelector<RequestActionState, AerDataReviewDecision> =>
  createDescendingSelector(selectReviewGroupDecisions, (payload) => payload?.[group] as AerDataReviewDecision);

const selectSummaryReviewGroupDecision = (group: AerSaveReviewGroupDecisionRequestTaskActionPayload['group']) =>
  createAggregateSelector(
    timelineCommonQuery.selectDownloadUrl,
    selectReviewAttachments,
    selectReviewGroupDecision(group),
    (downloadUrl, attachments, groupDecision) =>
      groupDecision
        ? {
            ...groupDecision,
            details: {
              ...groupDecision?.details,
              requiredChanges: (groupDecision as ReviewDecisionDto)?.details?.requiredChanges?.map((change) => ({
                ...change,
                files: change?.files?.map((file) => ({
                  fileName: attachments[file as any],
                  downloadUrl: `${downloadUrl}/${file}`,
                })),
              })),
            },
          }
        : null,
  );

export const aerTimelineCommonQuery = {
  selectAer,
  selectReportingRequired,
  selectReportingObligationDetails,
  selectAttachedFiles,
  selectOperatorDetails,
  selectMonitoringPlanVersion,
  selectMonitoringPlanChanges,
  selectAdditionalDocuments,
  selectShip,
  selectListOfShips,
  selectVoyagesList,
  selectVoyage,
  selectRelatedShipForVoyage,
  selectPortsList,
  selectPort,
  selectRelatedShipForPort,
  selectAggregatedDataList,
  selectAggregatedDataItem,
  selectRelatedShipForAggregatedData,
  selectReductionClaim,
  selectReductionClaimDetailsListItems,
  selectTotalEmissions,
  selectVerificationReport,
  selectVerifierDetails,
  selectOpinionStatement,
  selectEtsComplianceRules,
  selectComplianceMonitoringReporting,
  selectOverallVerificationDecision,
  selectUncorrectedMisstatements,
  selectUncorrectedNonConformities,
  selectUncorrectedNonCompliances,
  selectRecommendedImprovements,
  selectDataGapsMethodologies,
  selectMaterialityLevel,
  isReviewCompletedActionType,
  selectSummaryReviewGroupDecision,
  selectReviewGroupDecisions,
  selectEmissionsReductionClaimVerification,
};

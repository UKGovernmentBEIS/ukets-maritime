import {
  AerComplianceMonitoringReporting,
  AerDataGapsMethodologies,
  AerEtsComplianceRules,
  AerMaterialityLevel,
  AerOpinionStatement,
  AerRecommendedImprovements,
  AerUncorrectedMisstatements,
  AerUncorrectedNonCompliances,
  AerUncorrectedNonConformities,
  AerVerificationDecision,
  AerVerificationReport,
  AerVerifiedSatisfactoryWithCommentsDecision,
} from '@mrtm/api';

import { createDescendingSelector, requestTaskQuery, RequestTaskState, StateSelector } from '@netz/common/store';

import { AerVerificationSubmitTaskPayload, AerVerifierDetails } from '@requests/common/aer/aer.types';

const selectPayload: StateSelector<RequestTaskState, AerVerificationSubmitTaskPayload> = createDescendingSelector(
  requestTaskQuery.selectRequestTaskPayload,
  (payload) => payload,
);

const selectVerificationReport: StateSelector<RequestTaskState, AerVerificationReport> = createDescendingSelector(
  selectPayload,
  (payload) => payload?.verificationReport,
);

const selectVerifierDetails: StateSelector<RequestTaskState, AerVerifierDetails> = createDescendingSelector(
  selectVerificationReport,
  (verificationReport) => ({
    verificationBodyId: verificationReport?.verificationBodyId,
    verificationBodyDetails: verificationReport?.verificationBodyDetails,
    verifierContact: verificationReport?.verifierContact,
    verificationTeamDetails: verificationReport?.verificationTeamDetails,
  }),
);

const selectOpinionStatement: StateSelector<RequestTaskState, AerOpinionStatement> = createDescendingSelector(
  selectVerificationReport,
  (verificationReport) => verificationReport?.opinionStatement,
);

const selectEtsComplianceRules: StateSelector<RequestTaskState, AerEtsComplianceRules> = createDescendingSelector(
  selectVerificationReport,
  (verificationReport) => verificationReport?.etsComplianceRules,
);

const selectComplianceMonitoringReporting: StateSelector<RequestTaskState, AerComplianceMonitoringReporting> =
  createDescendingSelector(
    selectVerificationReport,
    (verificationReport) => verificationReport?.complianceMonitoringReporting,
  );

const selectOverallVerificationDecision: StateSelector<RequestTaskState, AerVerificationDecision> =
  createDescendingSelector(selectVerificationReport, (verificationReport) => verificationReport?.overallDecision);

const selectOverallVerificationDecisionReasons: StateSelector<
  RequestTaskState,
  AerVerifiedSatisfactoryWithCommentsDecision['reasons']
> = createDescendingSelector(selectVerificationReport, (verificationReport) =>
  verificationReport?.overallDecision?.type === 'VERIFIED_AS_SATISFACTORY_WITH_COMMENTS'
    ? ((verificationReport?.overallDecision as AerVerifiedSatisfactoryWithCommentsDecision)?.reasons ?? [])
    : [],
);

const selectUncorrectedMisstatements: StateSelector<RequestTaskState, AerUncorrectedMisstatements> =
  createDescendingSelector(
    selectVerificationReport,
    (verificationReport) => verificationReport?.uncorrectedMisstatements,
  );

const selectUncorrectedNonConformities: StateSelector<RequestTaskState, AerUncorrectedNonConformities> =
  createDescendingSelector(
    selectVerificationReport,
    (verificationReport) => verificationReport?.uncorrectedNonConformities,
  );

const selectUncorrectedNonCompliances: StateSelector<RequestTaskState, AerUncorrectedNonCompliances> =
  createDescendingSelector(
    selectVerificationReport,
    (verificationReport) => verificationReport?.uncorrectedNonCompliances,
  );

const selectRecommendedImprovements: StateSelector<RequestTaskState, AerRecommendedImprovements> =
  createDescendingSelector(
    selectVerificationReport,
    (verificationReport) => verificationReport?.recommendedImprovements,
  );

const selectDataGapsMethodologies: StateSelector<RequestTaskState, AerDataGapsMethodologies> = createDescendingSelector(
  selectVerificationReport,
  (verificationReport) => verificationReport?.dataGapsMethodologies,
);

const selectMaterialityLevel: StateSelector<RequestTaskState, AerMaterialityLevel> = createDescendingSelector(
  selectVerificationReport,
  (verificationReport) => verificationReport?.materialityLevel,
);

export const aerVerificationSubmitQuery = {
  selectPayload,
  selectVerificationReport,
  selectVerifierDetails,
  selectOpinionStatement,
  selectEtsComplianceRules,
  selectComplianceMonitoringReporting,
  selectOverallVerificationDecision,
  selectOverallVerificationDecisionReasons,
  selectUncorrectedMisstatements,
  selectUncorrectedNonConformities,
  selectUncorrectedNonCompliances,
  selectRecommendedImprovements,
  selectDataGapsMethodologies,
  selectMaterialityLevel,
};

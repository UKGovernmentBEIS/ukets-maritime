import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { PAYLOAD_MUTATORS, SIDE_EFFECTS, TaskApiService, TaskService, WIZARD_FLOW_MANAGERS } from '@netz/common/forms';

import {
  COMPLIANCE_MONITORING_REPORTING_SUB_TASK,
  DATA_GAPS_METHODOLOGIES_SUB_TASK,
  ETS_COMPLIANCE_RULES_SUB_TASK,
  MATERIALITY_LEVEL_SUB_TASK,
  OPINION_STATEMENT_SUB_TASK,
  OVERALL_VERIFICATION_DECISION_SUB_TASK,
  RECOMMENDED_IMPROVEMENTS_SUB_TASK,
  UNCORRECTED_MISSTATEMENTS_SUB_TASK,
  UNCORRECTED_NON_COMPLIANCES_SUB_TASK,
  UNCORRECTED_NON_CONFORMITIES_SUB_TASK,
  VERIFIER_DETAILS_SUB_TASK,
} from '@requests/common/aer';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK } from '@requests/common/aer/subtasks/emissions-reduction-claim-verification';
import { SECTIONS_COMPLETED_SELECTOR, SUBTASKS_AFFECTED_BY_IMPORT } from '@requests/common/third-party-data-provider';
import { ThirdPartyDataProviderImportFlowManager } from '@requests/common/third-party-data-provider/third-party-data-provider-import';
import { ThirdPartyDataProviderImportPayloadMutator } from '@requests/tasks/aer-verification-submit/payload-mutators';
import {
  provideThirdPartyExtraDetails,
  provideThirdPartyExtraWarnings,
  provideThirdPartySuccessMessage,
} from '@requests/tasks/aer-verification-submit/providers';
import {
  AerVerificationSubmitApiService,
  AerVerificationSubmitService,
} from '@requests/tasks/aer-verification-submit/services';
import {
  ComplianceMonitoringReportingAccuracyPayloadMutator,
  ComplianceMonitoringReportingCctPayloadMutator,
  ComplianceMonitoringReportingCompletenessPayloadMutator,
  ComplianceMonitoringReportingFlowManager,
  ComplianceMonitoringReportingInProgressSideEffect,
  ComplianceMonitoringReportingIntegrityPayloadMutator,
  ComplianceMonitoringReportingSummarySideEffect,
} from '@requests/tasks/aer-verification-submit/subtasks/compliance-monitoring-reporting';
import {
  DataGapsMethodologiesApprovedPayloadMutator,
  DataGapsMethodologiesConservativePayloadMutator,
  DataGapsMethodologiesFlowManager,
  DataGapsMethodologiesInProgressSideEffect,
  DataGapsMethodologiesMisstatementPayloadMutator,
  DataGapsMethodologiesRequiredPayloadMutator,
  DataGapsMethodologiesSummarySideEffect,
} from '@requests/tasks/aer-verification-submit/subtasks/data-gaps-methodologies';
import {
  EmissionsReductionClaimsVerificationFlowManager,
  EmissionsReductionClaimsVerificationInProgressSideEffect,
  EmissionsReductionClaimsVerificationSummarySideEffect,
  EmissionsReductionClaimVerificationFormPayload,
} from '@requests/tasks/aer-verification-submit/subtasks/emissions-reduction-claims-verification';
import {
  EtsComplianceRulesFlowManager,
  EtsComplianceRulesFormPayloadMutator,
  EtsComplianceRulesInProgressSideEffect,
  EtsComplianceRulesSummarySideEffect,
} from '@requests/tasks/aer-verification-submit/subtasks/ets-compliance-rules';
import {
  MaterialityLevelDetailsPayloadMutator,
  MaterialityLevelFlowManager,
  MaterialityLevelInProgressSideEffect,
  MaterialityLevelReferenceDocumentsPayloadMutator,
  MaterialityLevelSummarySideEffect,
} from '@requests/tasks/aer-verification-submit/subtasks/materiality-level';
import {
  OpinionStatementAdditionalChangesPayloadMutator,
  OpinionStatementEmissionsFormPayloadMutator,
  OpinionStatementFlowManager,
  OpinionStatementInProgressSideEffect,
  OpinionStatementSiteVisitInPersonPayloadMutator,
  OpinionStatementSiteVisitTypePayloadMutator,
  OpinionStatementSiteVisitVirtualPayloadMutator,
  OpinionStatementSummarySideEffect,
} from '@requests/tasks/aer-verification-submit/subtasks/opinion-statement';
import {
  OverallVerificationDecisionAssessmentPayloadMutator,
  OverallVerificationDecisionCommentsDeletePayloadMutator,
  OverallVerificationDecisionCommentsFormAddPayloadMutator,
  OverallVerificationDecisionCommentsFormEditPayloadMutator,
  OverallVerificationDecisionFlowManager,
  OverallVerificationDecisionInProgressSideEffect,
  OverallVerificationDecisionNotVerifiedReasonsPayloadMutator,
  OverallVerificationDecisionSummarySideEffect,
} from '@requests/tasks/aer-verification-submit/subtasks/overall-verification-decision';
import {
  RecommendedImprovementsExistPayloadMutator,
  RecommendedImprovementsFlowManager,
  RecommendedImprovementsImprovementDeletePayloadMutator,
  RecommendedImprovementsImprovementFormAddPayloadMutator,
  RecommendedImprovementsImprovementFormEditPayloadMutator,
  RecommendedImprovementsInProgressSideEffect,
  RecommendedImprovementsSummarySideEffect,
} from '@requests/tasks/aer-verification-submit/subtasks/recommended-improvements';
import {
  UncorrectedMisstatementsExistPayloadMutator,
  UncorrectedMisstatementsFlowManager,
  UncorrectedMisstatementsInProgressSideEffect,
  UncorrectedMisstatementsItemDeletePayloadMutator,
  UncorrectedMisstatementsItemFormAddPayloadMutator,
  UncorrectedMisstatementsItemFormEditPayloadMutator,
  UncorrectedMisstatementsSummarySideEffect,
} from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-misstatements';
import {
  UncorrectedNonCompliancesExistPayloadMutator,
  UncorrectedNonCompliancesFlowManager,
  UncorrectedNonCompliancesInProgressSideEffect,
  UncorrectedNonCompliancesItemDeletePayloadMutator,
  UncorrectedNonCompliancesItemFormAddPayloadMutator,
  UncorrectedNonCompliancesItemFormEditPayloadMutator,
  UncorrectedNonCompliancesSummarySideEffect,
} from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-compliances';
import {
  UncorrectedNonConformitiesExistPayloadMutator,
  UncorrectedNonConformitiesFlowManager,
  UncorrectedNonConformitiesInProgressSideEffect,
  UncorrectedNonConformitiesItemDeletePayloadMutator,
  UncorrectedNonConformitiesItemFormAddPayloadMutator,
  UncorrectedNonConformitiesItemFormEditPayloadMutator,
  UncorrectedNonConformitiesPriorYearIssueDeletePayloadMutator,
  UncorrectedNonConformitiesPriorYearIssueFormAddPayloadMutator,
  UncorrectedNonConformitiesPriorYearIssueFormEditPayloadMutator,
  UncorrectedNonConformitiesPriorYearIssuesExistPayloadMutator,
  UncorrectedNonConformitiesSummarySideEffect,
} from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities';
import {
  VerifierDetailsFlowManager,
  VerifierDetailsFormPayloadMutator,
  VerifierDetailsInProgressSideEffect,
  VerifierDetailsSummarySideEffect,
} from '@requests/tasks/aer-verification-submit/subtasks/verifier-details';

export function provideAerVerificationSubmitPayloadMutators(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: VerifierDetailsFormPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OpinionStatementEmissionsFormPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OpinionStatementAdditionalChangesPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OpinionStatementSiteVisitTypePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OpinionStatementSiteVisitInPersonPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OpinionStatementSiteVisitVirtualPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: EtsComplianceRulesFormPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ComplianceMonitoringReportingAccuracyPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ComplianceMonitoringReportingCompletenessPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ComplianceMonitoringReportingCctPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ComplianceMonitoringReportingIntegrityPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: EmissionsReductionClaimVerificationFormPayload },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OverallVerificationDecisionAssessmentPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OverallVerificationDecisionCommentsFormAddPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OverallVerificationDecisionCommentsFormEditPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OverallVerificationDecisionCommentsDeletePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: OverallVerificationDecisionNotVerifiedReasonsPayloadMutator },

    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UncorrectedMisstatementsExistPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UncorrectedMisstatementsItemFormAddPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UncorrectedMisstatementsItemFormEditPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UncorrectedMisstatementsItemDeletePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UncorrectedNonConformitiesExistPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UncorrectedNonConformitiesItemFormAddPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UncorrectedNonConformitiesItemFormEditPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UncorrectedNonConformitiesItemDeletePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UncorrectedNonConformitiesPriorYearIssuesExistPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UncorrectedNonConformitiesPriorYearIssueFormAddPayloadMutator },
    {
      provide: PAYLOAD_MUTATORS,
      multi: true,
      useClass: UncorrectedNonConformitiesPriorYearIssueFormEditPayloadMutator,
    },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UncorrectedNonConformitiesPriorYearIssueDeletePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UncorrectedNonCompliancesExistPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UncorrectedNonCompliancesItemFormAddPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UncorrectedNonCompliancesItemFormEditPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: UncorrectedNonCompliancesItemDeletePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: RecommendedImprovementsExistPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: RecommendedImprovementsImprovementFormAddPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: RecommendedImprovementsImprovementFormEditPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: RecommendedImprovementsImprovementDeletePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: DataGapsMethodologiesRequiredPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: DataGapsMethodologiesApprovedPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: DataGapsMethodologiesConservativePayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: DataGapsMethodologiesMisstatementPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: MaterialityLevelDetailsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: MaterialityLevelReferenceDocumentsPayloadMutator },
    { provide: PAYLOAD_MUTATORS, multi: true, useClass: ThirdPartyDataProviderImportPayloadMutator },
  ]);
}

export function provideAerVerificationSubmitTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskApiService, useClass: AerVerificationSubmitApiService },
    { provide: TaskService, useClass: AerVerificationSubmitService },
  ]);
}

export function provideAerVerificationSubmitSideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SIDE_EFFECTS, multi: true, useClass: VerifierDetailsInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: VerifierDetailsSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: OpinionStatementInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: OpinionStatementSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: EtsComplianceRulesInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: EtsComplianceRulesSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: ComplianceMonitoringReportingInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: ComplianceMonitoringReportingSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: EmissionsReductionClaimsVerificationInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: EmissionsReductionClaimsVerificationSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: OverallVerificationDecisionInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: OverallVerificationDecisionSummarySideEffect },

    { provide: SIDE_EFFECTS, multi: true, useClass: UncorrectedMisstatementsInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: UncorrectedMisstatementsSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: UncorrectedNonConformitiesInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: UncorrectedNonConformitiesSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: UncorrectedNonCompliancesInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: UncorrectedNonCompliancesSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: RecommendedImprovementsInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: RecommendedImprovementsSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: DataGapsMethodologiesInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: DataGapsMethodologiesSummarySideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: MaterialityLevelInProgressSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: MaterialityLevelSummarySideEffect },
  ]);
}

export function provideAerVerificationSubmitStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: VerifierDetailsFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: OpinionStatementFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: EtsComplianceRulesFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: ComplianceMonitoringReportingFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: EmissionsReductionClaimsVerificationFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: OverallVerificationDecisionFlowManager },

    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: UncorrectedMisstatementsFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: UncorrectedNonConformitiesFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: UncorrectedNonCompliancesFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: RecommendedImprovementsFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: DataGapsMethodologiesFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: MaterialityLevelFlowManager },
    { provide: WIZARD_FLOW_MANAGERS, multi: true, useClass: ThirdPartyDataProviderImportFlowManager },
  ]);
}

export function provideThirdPartyConfigurations(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: SUBTASKS_AFFECTED_BY_IMPORT,
      useValue: [
        COMPLIANCE_MONITORING_REPORTING_SUB_TASK,
        DATA_GAPS_METHODOLOGIES_SUB_TASK,
        EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK,
        ETS_COMPLIANCE_RULES_SUB_TASK,
        MATERIALITY_LEVEL_SUB_TASK,
        OPINION_STATEMENT_SUB_TASK,
        OVERALL_VERIFICATION_DECISION_SUB_TASK,
        RECOMMENDED_IMPROVEMENTS_SUB_TASK,
        UNCORRECTED_MISSTATEMENTS_SUB_TASK,
        UNCORRECTED_NON_COMPLIANCES_SUB_TASK,
        UNCORRECTED_NON_CONFORMITIES_SUB_TASK,
        VERIFIER_DETAILS_SUB_TASK,
      ],
    },
    {
      provide: SECTIONS_COMPLETED_SELECTOR,
      useValue: aerCommonQuery.selectVerificationSectionsCompleted,
    },
    provideThirdPartyExtraWarnings(),
    provideThirdPartyExtraDetails(),
    provideThirdPartySuccessMessage(),
  ]);
}

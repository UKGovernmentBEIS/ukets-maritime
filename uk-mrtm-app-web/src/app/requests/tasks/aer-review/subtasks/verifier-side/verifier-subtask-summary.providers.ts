import { Provider } from '@angular/core';

import { RequestTaskStore } from '@netz/common/store';

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
import { AER_REVIEW_SUBTASK_DETAILS } from '@requests/tasks/aer-review/aer-review.constants';
import { AerReviewSummaryDetailsSection, AerReviewTaskPayload } from '@requests/tasks/aer-review/aer-review.types';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import {
  AerOverallVerificationDecisionSummaryTemplateComponent,
  ComplianceMonitoringReportingSummaryTemplateComponent,
  DataGapsMethodologiesSummaryTemplateComponent,
  EtsComplianceRulesSummaryTemplateComponent,
  MaterialityLevelSummaryTemplateComponent,
  OpinionStatementSummaryTemplateComponent,
  RecommendedImprovementsSummaryTemplateComponent,
  UncorrectedMisstatementsSummaryTemplateComponent,
  UncorrectedNonCompliancesSummaryTemplateComponent,
  UncorrectedNonConformitiesSummaryTemplateComponent,
  VerifierDetailsSummaryTemplateComponent,
} from '@shared/components';

const provideVerificationDetailsSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: VerifierDetailsSummaryTemplateComponent,
      inputs: {
        data: store.select(aerVerificationSubmitQuery.selectVerifierDetails)(),
      },
    };
  },
};

const provideOpinionStatementSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: OpinionStatementSummaryTemplateComponent,
      inputs: {
        opinionStatement: store.select(aerVerificationSubmitQuery.selectOpinionStatement)(),
        totalEmissions: store.select(aerCommonQuery.selectTotalEmissions)(),
        monitoringPlanVersion: store.select(aerCommonQuery.selectMonitoringPlanVersion)(),
        monitoringPlanChanges: store.select(aerCommonQuery.selectMonitoringPlanChanges)(),
      },
    };
  },
};

const provideETSComplianceRulesSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: EtsComplianceRulesSummaryTemplateComponent,
      inputs: {
        data: store.select(aerVerificationSubmitQuery.selectEtsComplianceRules)(),
      },
    };
  },
};

const provideComplianceMonitoringReportingSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: ComplianceMonitoringReportingSummaryTemplateComponent,
      inputs: {
        data: store.select(aerVerificationSubmitQuery.selectComplianceMonitoringReporting)(),
      },
    };
  },
};

const provideOverallVerificationDecisionSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: AerOverallVerificationDecisionSummaryTemplateComponent,
      inputs: {
        data: store.select(aerVerificationSubmitQuery.selectOverallVerificationDecision)(),
      },
    };
  },
};

const provideUncorrectedMisstatementsSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: UncorrectedMisstatementsSummaryTemplateComponent,
      inputs: {
        data: store.select(aerVerificationSubmitQuery.selectUncorrectedMisstatements)(),
      },
    };
  },
};

const provideUncorrectedNonConformitiesSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: UncorrectedNonConformitiesSummaryTemplateComponent,
      inputs: {
        data: store.select(aerVerificationSubmitQuery.selectUncorrectedNonConformities)(),
      },
    };
  },
};

const provideUncorrectedNonCompliancesSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: UncorrectedNonCompliancesSummaryTemplateComponent,
      inputs: {
        data: store.select(aerVerificationSubmitQuery.selectUncorrectedNonCompliances)(),
      },
    };
  },
};

const provideRecommendedImprovementsSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: RecommendedImprovementsSummaryTemplateComponent,
      inputs: {
        data: store.select(aerVerificationSubmitQuery.selectRecommendedImprovements)(),
      },
    };
  },
};

const provideDataGapsMethodologiesSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: DataGapsMethodologiesSummaryTemplateComponent,
      inputs: {
        data: store.select(aerVerificationSubmitQuery.selectDataGapsMethodologies)(),
      },
    };
  },
};

const provideMaterialityLevelSubtaskSummary: Provider = {
  provide: AER_REVIEW_SUBTASK_DETAILS,
  deps: [RequestTaskStore],
  useFactory: (store: RequestTaskStore): AerReviewSummaryDetailsSection => {
    return {
      component: MaterialityLevelSummaryTemplateComponent,
      inputs: {
        data: store.select(aerVerificationSubmitQuery.selectMaterialityLevel)(),
      },
    };
  },
};

export const verifierSideSummariesProvidersMap: Partial<
  Record<keyof AerReviewTaskPayload['verificationReport'] | string, Provider>
> = {
  [VERIFIER_DETAILS_SUB_TASK]: provideVerificationDetailsSubtaskSummary,
  [OPINION_STATEMENT_SUB_TASK]: provideOpinionStatementSubtaskSummary,
  [ETS_COMPLIANCE_RULES_SUB_TASK]: provideETSComplianceRulesSubtaskSummary,
  [COMPLIANCE_MONITORING_REPORTING_SUB_TASK]: provideComplianceMonitoringReportingSubtaskSummary,
  [OVERALL_VERIFICATION_DECISION_SUB_TASK]: provideOverallVerificationDecisionSubtaskSummary,
  [UNCORRECTED_MISSTATEMENTS_SUB_TASK]: provideUncorrectedMisstatementsSubtaskSummary,
  [UNCORRECTED_NON_CONFORMITIES_SUB_TASK]: provideUncorrectedNonConformitiesSubtaskSummary,
  [UNCORRECTED_NON_COMPLIANCES_SUB_TASK]: provideUncorrectedNonCompliancesSubtaskSummary,
  [RECOMMENDED_IMPROVEMENTS_SUB_TASK]: provideRecommendedImprovementsSubtaskSummary,
  [DATA_GAPS_METHODOLOGIES_SUB_TASK]: provideDataGapsMethodologiesSubtaskSummary,
  [MATERIALITY_LEVEL_SUB_TASK]: provideMaterialityLevelSubtaskSummary,
};

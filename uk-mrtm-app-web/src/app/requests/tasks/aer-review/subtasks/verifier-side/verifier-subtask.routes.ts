import { Routes } from '@angular/router';

import {
  COMPLIANCE_MONITORING_REPORTING_SUB_TASK,
  COMPLIANCE_MONITORING_REPORTING_SUB_TASK_PATH,
  complianceMonitoringReportingMap,
  DATA_GAPS_METHODOLOGIES_SUB_TASK,
  DATA_GAPS_METHODOLOGIES_SUB_TASK_PATH,
  dataGapsMethodologiesMap,
  ETS_COMPLIANCE_RULES_SUB_TASK,
  ETS_COMPLIANCE_RULES_SUB_TASK_PATH,
  etsComplianceRulesMap,
  MATERIALITY_LEVEL_SUB_TASK,
  MATERIALITY_LEVEL_SUB_TASK_PATH,
  materialityLevelMap,
  OPINION_STATEMENT_SUB_TASK,
  OPINION_STATEMENT_SUB_TASK_PATH,
  opinionStatementMap,
  OVERALL_VERIFICATION_DECISION_SUB_TASK,
  OVERALL_VERIFICATION_DECISION_SUB_TASK_PATH,
  overallVerificationDecisionMap,
  RECOMMENDED_IMPROVEMENTS_SUB_TASK,
  RECOMMENDED_IMPROVEMENTS_SUB_TASK_PATH,
  recommendedImprovementsMap,
  UNCORRECTED_MISSTATEMENTS_SUB_TASK,
  UNCORRECTED_MISSTATEMENTS_SUB_TASK_PATH,
  UNCORRECTED_NON_COMPLIANCES_SUB_TASK,
  UNCORRECTED_NON_COMPLIANCES_SUB_TASK_PATH,
  UNCORRECTED_NON_CONFORMITIES_SUB_TASK,
  UNCORRECTED_NON_CONFORMITIES_SUB_TASK_PATH,
  uncorrectedMisstatementsMap,
  uncorrectedNonCompliancesMap,
  uncorrectedNonConformitiesMap,
  VERIFIER_DETAILS_SUB_TASK,
  VERIFIER_DETAILS_SUB_TASK_PATH,
  verifierDetailsMap,
} from '@requests/common/aer';
import {
  EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK,
  EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK_PATH,
  emissionsReductionClaimVerificationSubtaskListMap,
} from '@requests/common/aer/subtasks/emissions-reduction-claim-verification';
import {
  AER_REVIEW_GROUP,
  AER_REVIEW_SUBTASK,
  AER_REVIEW_TASK_TITLE,
} from '@requests/tasks/aer-review/aer-review.constants';
import { verifierSideSummariesProvidersMap } from '@requests/tasks/aer-review/subtasks/verifier-side/verifier-subtask-summary.providers';

export const VERIFIER_SUBTASK_ROUTES: Routes = [
  {
    path: VERIFIER_DETAILS_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: VERIFIER_DETAILS_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: verifierDetailsMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'VERIFIER_DETAILS' },
      verifierSideSummariesProvidersMap[VERIFIER_DETAILS_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: OPINION_STATEMENT_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: OPINION_STATEMENT_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: opinionStatementMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'OPINION_STATEMENT' },
      verifierSideSummariesProvidersMap[OPINION_STATEMENT_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: ETS_COMPLIANCE_RULES_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: ETS_COMPLIANCE_RULES_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: etsComplianceRulesMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'ETS_COMPLIANCE_RULES' },
      verifierSideSummariesProvidersMap[ETS_COMPLIANCE_RULES_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: COMPLIANCE_MONITORING_REPORTING_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: COMPLIANCE_MONITORING_REPORTING_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: complianceMonitoringReportingMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'COMPLIANCE_MONITORING_REPORTING' },
      verifierSideSummariesProvidersMap[COMPLIANCE_MONITORING_REPORTING_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: OVERALL_VERIFICATION_DECISION_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: OVERALL_VERIFICATION_DECISION_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: overallVerificationDecisionMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'OVERALL_DECISION' },
      verifierSideSummariesProvidersMap[OVERALL_VERIFICATION_DECISION_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: UNCORRECTED_MISSTATEMENTS_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: UNCORRECTED_MISSTATEMENTS_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: uncorrectedMisstatementsMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'UNCORRECTED_MISSTATEMENTS' },
      verifierSideSummariesProvidersMap[UNCORRECTED_MISSTATEMENTS_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: UNCORRECTED_NON_CONFORMITIES_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: UNCORRECTED_NON_CONFORMITIES_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: uncorrectedNonConformitiesMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'UNCORRECTED_NON_CONFORMITIES' },
      verifierSideSummariesProvidersMap[UNCORRECTED_NON_CONFORMITIES_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: UNCORRECTED_NON_COMPLIANCES_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: UNCORRECTED_NON_COMPLIANCES_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: uncorrectedNonCompliancesMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'UNCORRECTED_NON_COMPLIANCES' },
      verifierSideSummariesProvidersMap[UNCORRECTED_NON_COMPLIANCES_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: RECOMMENDED_IMPROVEMENTS_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: RECOMMENDED_IMPROVEMENTS_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: recommendedImprovementsMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'RECOMMENDED_IMPROVEMENTS' },
      verifierSideSummariesProvidersMap[RECOMMENDED_IMPROVEMENTS_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: DATA_GAPS_METHODOLOGIES_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: DATA_GAPS_METHODOLOGIES_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: dataGapsMethodologiesMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'CLOSE_DATA_GAPS_METHODOLOGIES' },
      verifierSideSummariesProvidersMap[DATA_GAPS_METHODOLOGIES_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: MATERIALITY_LEVEL_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: MATERIALITY_LEVEL_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: materialityLevelMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'MATERIALITY_LEVEL' },
      verifierSideSummariesProvidersMap[MATERIALITY_LEVEL_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
  {
    path: EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK_PATH,
    providers: [
      { provide: AER_REVIEW_SUBTASK, useValue: EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK },
      { provide: AER_REVIEW_TASK_TITLE, useValue: emissionsReductionClaimVerificationSubtaskListMap.title },
      { provide: AER_REVIEW_GROUP, useValue: 'EMISSIONS_REDUCTION_CLAIM_VERIFICATION' },
      verifierSideSummariesProvidersMap[EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK],
    ],
    loadChildren: () =>
      import('@requests/tasks/aer-review/subtasks/review-application').then((r) => r.REVIEW_APPLICATION_ROUTES),
  },
];

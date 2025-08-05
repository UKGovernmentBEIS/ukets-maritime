import { Routes } from '@angular/router';

import { COMPLIANCE_MONITORING_REPORTING_SUB_TASK_PATH } from '@requests/common/aer/subtasks/compliance-monitoring-reporting/compliance-monitoring-reporting.helpers';
import { DATA_GAPS_METHODOLOGIES_SUB_TASK_PATH } from '@requests/common/aer/subtasks/data-gaps-methodologies/data-gaps-methodologies.helpers';
import { ETS_COMPLIANCE_RULES_SUB_TASK_PATH } from '@requests/common/aer/subtasks/ets-compliance-rules/ets-compliance-rules.helpers';
import { MATERIALITY_LEVEL_SUB_TASK_PATH } from '@requests/common/aer/subtasks/materiality-level/materiality-level.helpers';
import { OPINION_STATEMENT_SUB_TASK_PATH } from '@requests/common/aer/subtasks/opinion-statement/opinion-statement.helpers';
import { OVERALL_VERIFICATION_DECISION_SUB_TASK_PATH } from '@requests/common/aer/subtasks/overall-verification-decision/overall-verification-decision.helpers';
import { RECOMMENDED_IMPROVEMENTS_SUB_TASK_PATH } from '@requests/common/aer/subtasks/recommended-improvements/recommended-improvements.helpers';
import { UNCORRECTED_MISSTATEMENTS_SUB_TASK_PATH } from '@requests/common/aer/subtasks/uncorrected-misstatements/uncorrected-misstatements.helpers';
import { UNCORRECTED_NON_COMPLIANCES_SUB_TASK_PATH } from '@requests/common/aer/subtasks/uncorrected-non-compliances/uncorrected-non-compliances.helpers';
import { UNCORRECTED_NON_CONFORMITIES_SUB_TASK_PATH } from '@requests/common/aer/subtasks/uncorrected-non-conformities/uncorrected-non-conformities.helpers';
import { VERIFIER_DETAILS_SUB_TASK_PATH } from '@requests/common/aer/subtasks/verifier-details/verifier-details.helpers';

export const AER_VERIFICATION_SUBMITTED_ROUTES_COMMON_CHILDREN: Routes = [
  {
    path: VERIFIER_DETAILS_SUB_TASK_PATH,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/verifier-details-submitted').then(
        (c) => c.VerifierDetailsSubmittedComponent,
      ),
  },
  {
    path: OPINION_STATEMENT_SUB_TASK_PATH,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/opinion-statement-submitted').then(
        (c) => c.OpinionStatementSubmittedComponent,
      ),
  },
  {
    path: ETS_COMPLIANCE_RULES_SUB_TASK_PATH,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/ets-compliance-rules-submitted').then(
        (c) => c.EtsComplianceRulesSubmittedComponent,
      ),
  },
  {
    path: COMPLIANCE_MONITORING_REPORTING_SUB_TASK_PATH,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/compliance-monitoring-reporting-submitted').then(
        (c) => c.ComplianceMonitoringReportingSubmittedComponent,
      ),
  },
  {
    path: OVERALL_VERIFICATION_DECISION_SUB_TASK_PATH,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/overall-verification-decision-submitted').then(
        (c) => c.OverallVerificationDecisionSubmittedComponent,
      ),
  },

  // Verifier findings
  {
    path: UNCORRECTED_MISSTATEMENTS_SUB_TASK_PATH,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/uncorrected-misstatements-submitted').then(
        (c) => c.UncorrectedMisstatementsSubmittedComponent,
      ),
  },
  {
    path: UNCORRECTED_NON_CONFORMITIES_SUB_TASK_PATH,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/uncorrected-non-conformities-submitted').then(
        (c) => c.UncorrectedNonConformitiesSubmittedComponent,
      ),
  },
  {
    path: UNCORRECTED_NON_COMPLIANCES_SUB_TASK_PATH,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/uncorrected-non-compliances-submitted').then(
        (c) => c.UncorrectedNonCompliancesSubmittedComponent,
      ),
  },
  {
    path: RECOMMENDED_IMPROVEMENTS_SUB_TASK_PATH,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/recommended-improvements-submitted').then(
        (c) => c.RecommendedImprovementsSubmittedComponent,
      ),
  },
  {
    path: DATA_GAPS_METHODOLOGIES_SUB_TASK_PATH,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/data-gaps-methodologies-submitted').then(
        (c) => c.DataGapsMethodologiesSubmittedComponent,
      ),
  },
  {
    path: MATERIALITY_LEVEL_SUB_TASK_PATH,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/timeline/aer-common/subtasks/materiality-level-submitted').then(
        (c) => c.MaterialityLevelSubmittedComponent,
      ),
  },
];

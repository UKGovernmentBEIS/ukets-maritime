import { aerAdditionalDocumentsMap } from '@requests/common/aer/subtasks/aer-additional-documents';
import {
  AER_AGGREGATED_DATA_SUB_TASK,
  aerAggregatedDataSubtasksListMap,
} from '@requests/common/aer/subtasks/aer-aggregated-data';
import { AER_PORTS_SUB_TASK, aerPortsMap } from '@requests/common/aer/subtasks/aer-ports';
import {
  aerEmissionsMap,
  aerTotalEmissionsMap,
  monitoringPlanChangesMap,
  reportingObligationMap,
} from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import { AER_TOTAL_EMISSIONS_SUB_TASK } from '@requests/common/aer/subtasks/aer-total-emissions';
import { AER_VOYAGES_SUB_TASK, aerVoyagesMap } from '@requests/common/aer/subtasks/aer-voyages';
import {
  COMPLIANCE_MONITORING_REPORTING_SUB_TASK,
  complianceMonitoringReportingMap,
} from '@requests/common/aer/subtasks/compliance-monitoring-reporting';
import {
  DATA_GAPS_METHODOLOGIES_SUB_TASK,
  dataGapsMethodologiesMap,
} from '@requests/common/aer/subtasks/data-gaps-methodologies';
import {
  ETS_COMPLIANCE_RULES_SUB_TASK,
  etsComplianceRulesMap,
} from '@requests/common/aer/subtasks/ets-compliance-rules';
import { MATERIALITY_LEVEL_SUB_TASK, materialityLevelMap } from '@requests/common/aer/subtasks/materiality-level';
import { MONITORING_PLAN_CHANGES_SUB_TASK } from '@requests/common/aer/subtasks/monitoring-plan-changes';
import { OPINION_STATEMENT_SUB_TASK, opinionStatementMap } from '@requests/common/aer/subtasks/opinion-statement';
import {
  OVERALL_VERIFICATION_DECISION_SUB_TASK,
  overallVerificationDecisionMap,
} from '@requests/common/aer/subtasks/overall-verification-decision';
import {
  RECOMMENDED_IMPROVEMENTS_SUB_TASK,
  recommendedImprovementsMap,
} from '@requests/common/aer/subtasks/recommended-improvements';
import { AER_REDUCTION_CLAIM_SUB_TASK, reductionClaimMap } from '@requests/common/aer/subtasks/reduction-claim';
import { REPORTING_OBLIGATION_SUB_TASK } from '@requests/common/aer/subtasks/reporting-obligation';
import {
  UNCORRECTED_MISSTATEMENTS_SUB_TASK,
  uncorrectedMisstatementsMap,
} from '@requests/common/aer/subtasks/uncorrected-misstatements';
import {
  UNCORRECTED_NON_COMPLIANCES_SUB_TASK,
  uncorrectedNonCompliancesMap,
} from '@requests/common/aer/subtasks/uncorrected-non-compliances';
import {
  UNCORRECTED_NON_CONFORMITIES_SUB_TASK,
  uncorrectedNonConformitiesMap,
} from '@requests/common/aer/subtasks/uncorrected-non-conformities';
import { VERIFIER_DETAILS_SUB_TASK, verifierDetailsMap } from '@requests/common/aer/subtasks/verifier-details';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { OPERATOR_DETAILS_SUB_TASK, operatorDetailsMap } from '@requests/common/components/operator-details';
import { ADDITIONAL_DOCUMENTS_SUB_TASK } from '@requests/common/utils/additional-documents';

export const AER_REVIEW_SUBTASK_TO_TITLE_MAP: Record<string, string> = {
  [VERIFIER_DETAILS_SUB_TASK]: verifierDetailsMap.title,
  [OPINION_STATEMENT_SUB_TASK]: opinionStatementMap.title,
  [ETS_COMPLIANCE_RULES_SUB_TASK]: etsComplianceRulesMap.caption,
  [COMPLIANCE_MONITORING_REPORTING_SUB_TASK]: complianceMonitoringReportingMap.title,
  [OVERALL_VERIFICATION_DECISION_SUB_TASK]: overallVerificationDecisionMap.title,
  [UNCORRECTED_MISSTATEMENTS_SUB_TASK]: uncorrectedMisstatementsMap.title,
  [UNCORRECTED_NON_CONFORMITIES_SUB_TASK]: uncorrectedNonConformitiesMap.title,
  [UNCORRECTED_NON_COMPLIANCES_SUB_TASK]: uncorrectedNonCompliancesMap.title,
  [RECOMMENDED_IMPROVEMENTS_SUB_TASK]: recommendedImprovementsMap.title,
  [DATA_GAPS_METHODOLOGIES_SUB_TASK]: dataGapsMethodologiesMap.title,
  [MATERIALITY_LEVEL_SUB_TASK]: materialityLevelMap.title,
  [OPERATOR_DETAILS_SUB_TASK]: operatorDetailsMap.title,
  [MONITORING_PLAN_CHANGES_SUB_TASK]: monitoringPlanChangesMap.title,
  [EMISSIONS_SUB_TASK]: aerEmissionsMap.title,
  [AER_VOYAGES_SUB_TASK]: aerVoyagesMap.caption,
  [AER_PORTS_SUB_TASK]: aerPortsMap.caption,
  [AER_AGGREGATED_DATA_SUB_TASK]: aerAggregatedDataSubtasksListMap.caption,
  [AER_REDUCTION_CLAIM_SUB_TASK]: reductionClaimMap.title,
  [ADDITIONAL_DOCUMENTS_SUB_TASK]: aerAdditionalDocumentsMap.title,
  [AER_TOTAL_EMISSIONS_SUB_TASK]: aerTotalEmissionsMap.title,
  [REPORTING_OBLIGATION_SUB_TASK]: reportingObligationMap.title,
};

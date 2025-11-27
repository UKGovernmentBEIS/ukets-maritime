import { AER_AGGREGATED_DATA_SUB_TASK } from '@requests/common/aer/subtasks/aer-aggregated-data';
import { AER_PORTS_SUB_TASK } from '@requests/common/aer/subtasks/aer-ports';
import { AER_TOTAL_EMISSIONS_SUB_TASK } from '@requests/common/aer/subtasks/aer-total-emissions';
import { AER_VOYAGES_SUB_TASK } from '@requests/common/aer/subtasks/aer-voyages';
import { COMPLIANCE_MONITORING_REPORTING_SUB_TASK } from '@requests/common/aer/subtasks/compliance-monitoring-reporting';
import { DATA_GAPS_METHODOLOGIES_SUB_TASK } from '@requests/common/aer/subtasks/data-gaps-methodologies';
import { EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK } from '@requests/common/aer/subtasks/emissions-reduction-claim-verification';
import { ETS_COMPLIANCE_RULES_SUB_TASK } from '@requests/common/aer/subtasks/ets-compliance-rules';
import { MATERIALITY_LEVEL_SUB_TASK } from '@requests/common/aer/subtasks/materiality-level';
import { MONITORING_PLAN_CHANGES_SUB_TASK } from '@requests/common/aer/subtasks/monitoring-plan-changes';
import { OPINION_STATEMENT_SUB_TASK } from '@requests/common/aer/subtasks/opinion-statement';
import { OVERALL_VERIFICATION_DECISION_SUB_TASK } from '@requests/common/aer/subtasks/overall-verification-decision';
import { RECOMMENDED_IMPROVEMENTS_SUB_TASK } from '@requests/common/aer/subtasks/recommended-improvements';
import { AER_REDUCTION_CLAIM_SUB_TASK } from '@requests/common/aer/subtasks/reduction-claim';
import { REPORTING_OBLIGATION_SUB_TASK } from '@requests/common/aer/subtasks/reporting-obligation';
import { UNCORRECTED_MISSTATEMENTS_SUB_TASK } from '@requests/common/aer/subtasks/uncorrected-misstatements';
import { UNCORRECTED_NON_COMPLIANCES_SUB_TASK } from '@requests/common/aer/subtasks/uncorrected-non-compliances';
import { UNCORRECTED_NON_CONFORMITIES_SUB_TASK } from '@requests/common/aer/subtasks/uncorrected-non-conformities';
import { VERIFIER_DETAILS_SUB_TASK } from '@requests/common/aer/subtasks/verifier-details';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { OPERATOR_DETAILS_SUB_TASK } from '@requests/common/components/operator-details';
import { ADDITIONAL_DOCUMENTS_SUB_TASK } from '@requests/common/utils/additional-documents';

export const AER_SUBTASK_REVIEW_GROUP_MAP: Record<string, string> = {
  [REPORTING_OBLIGATION_SUB_TASK]: 'REPORTING_OBLIGATION_DETAILS',
  [VERIFIER_DETAILS_SUB_TASK]: 'VERIFIER_DETAILS',
  [OPINION_STATEMENT_SUB_TASK]: 'OPINION_STATEMENT',
  [ETS_COMPLIANCE_RULES_SUB_TASK]: 'ETS_COMPLIANCE_RULES',
  [COMPLIANCE_MONITORING_REPORTING_SUB_TASK]: 'COMPLIANCE_MONITORING_REPORTING',
  [OVERALL_VERIFICATION_DECISION_SUB_TASK]: 'OVERALL_DECISION',
  [UNCORRECTED_MISSTATEMENTS_SUB_TASK]: 'UNCORRECTED_MISSTATEMENTS',
  [UNCORRECTED_NON_CONFORMITIES_SUB_TASK]: 'UNCORRECTED_NON_CONFORMITIES',
  [UNCORRECTED_NON_COMPLIANCES_SUB_TASK]: 'UNCORRECTED_NON_COMPLIANCES',
  [RECOMMENDED_IMPROVEMENTS_SUB_TASK]: 'RECOMMENDED_IMPROVEMENTS',
  [DATA_GAPS_METHODOLOGIES_SUB_TASK]: 'CLOSE_DATA_GAPS_METHODOLOGIES',
  [MATERIALITY_LEVEL_SUB_TASK]: 'MATERIALITY_LEVEL',
  [OPERATOR_DETAILS_SUB_TASK]: 'OPERATOR_DETAILS',
  [MONITORING_PLAN_CHANGES_SUB_TASK]: 'MONITORING_PLAN_CHANGES',
  [EMISSIONS_SUB_TASK]: 'LIST_OF_SHIPS',
  [AER_VOYAGES_SUB_TASK]: 'VOYAGES',
  [AER_PORTS_SUB_TASK]: 'PORTS',
  [AER_AGGREGATED_DATA_SUB_TASK]: 'AGGREGATED_EMISSIONS_DATA',
  [AER_REDUCTION_CLAIM_SUB_TASK]: 'EMISSIONS_REDUCTION_CLAIM',
  [ADDITIONAL_DOCUMENTS_SUB_TASK]: 'ADDITIONAL_DOCUMENTS',
  [AER_TOTAL_EMISSIONS_SUB_TASK]: 'TOTAL_EMISSIONS',
  [EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK]: 'EMISSIONS_REDUCTION_CLAIM_VERIFICATION',
};

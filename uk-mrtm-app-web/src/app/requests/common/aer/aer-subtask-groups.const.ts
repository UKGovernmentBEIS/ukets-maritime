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

export const REPORTING_OBLIGATION_SUBTASKS = [REPORTING_OBLIGATION_SUB_TASK];

export const OPERATOR_SUBTASKS = [
  OPERATOR_DETAILS_SUB_TASK,
  MONITORING_PLAN_CHANGES_SUB_TASK,
  EMISSIONS_SUB_TASK,
  AER_VOYAGES_SUB_TASK,
  AER_PORTS_SUB_TASK,
  AER_AGGREGATED_DATA_SUB_TASK,
  AER_REDUCTION_CLAIM_SUB_TASK,
  ADDITIONAL_DOCUMENTS_SUB_TASK,
  AER_TOTAL_EMISSIONS_SUB_TASK,
];

export const VERIFIER_SUBTASKS = [
  VERIFIER_DETAILS_SUB_TASK,
  OPINION_STATEMENT_SUB_TASK,
  ETS_COMPLIANCE_RULES_SUB_TASK,
  COMPLIANCE_MONITORING_REPORTING_SUB_TASK,
  OVERALL_VERIFICATION_DECISION_SUB_TASK,
  UNCORRECTED_MISSTATEMENTS_SUB_TASK,
  UNCORRECTED_NON_CONFORMITIES_SUB_TASK,
  UNCORRECTED_NON_COMPLIANCES_SUB_TASK,
  RECOMMENDED_IMPROVEMENTS_SUB_TASK,
  DATA_GAPS_METHODOLOGIES_SUB_TASK,
  MATERIALITY_LEVEL_SUB_TASK,
  EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK,
];

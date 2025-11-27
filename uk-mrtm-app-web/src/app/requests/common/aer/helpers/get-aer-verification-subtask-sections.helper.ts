import { Aer } from '@mrtm/api';

import { TaskSection } from '@netz/common/model';

import { selectStatusForSubtask } from '@requests/common/aer/helpers/common.helpers';
import {
  COMPLIANCE_MONITORING_REPORTING_SUB_TASK,
  COMPLIANCE_MONITORING_REPORTING_SUB_TASK_PATH,
  complianceMonitoringReportingMap,
} from '@requests/common/aer/subtasks/compliance-monitoring-reporting';
import {
  DATA_GAPS_METHODOLOGIES_SUB_TASK,
  DATA_GAPS_METHODOLOGIES_SUB_TASK_PATH,
  dataGapsMethodologiesMap,
} from '@requests/common/aer/subtasks/data-gaps-methodologies';
import {
  EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK,
  EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK_PATH,
  emissionsReductionClaimVerificationSubtaskListMap,
} from '@requests/common/aer/subtasks/emissions-reduction-claim-verification';
import {
  ETS_COMPLIANCE_RULES_SUB_TASK,
  ETS_COMPLIANCE_RULES_SUB_TASK_PATH,
  etsComplianceRulesMap,
} from '@requests/common/aer/subtasks/ets-compliance-rules';
import {
  MATERIALITY_LEVEL_SUB_TASK,
  MATERIALITY_LEVEL_SUB_TASK_PATH,
  materialityLevelMap,
} from '@requests/common/aer/subtasks/materiality-level';
import {
  OPINION_STATEMENT_SUB_TASK,
  OPINION_STATEMENT_SUB_TASK_PATH,
  opinionStatementMap,
} from '@requests/common/aer/subtasks/opinion-statement';
import {
  OVERALL_VERIFICATION_DECISION_SUB_TASK,
  OVERALL_VERIFICATION_DECISION_SUB_TASK_PATH,
  overallVerificationDecisionMap,
} from '@requests/common/aer/subtasks/overall-verification-decision';
import {
  RECOMMENDED_IMPROVEMENTS_SUB_TASK,
  RECOMMENDED_IMPROVEMENTS_SUB_TASK_PATH,
  recommendedImprovementsMap,
} from '@requests/common/aer/subtasks/recommended-improvements';
import {
  UNCORRECTED_MISSTATEMENTS_SUB_TASK,
  UNCORRECTED_MISSTATEMENTS_SUB_TASK_PATH,
  uncorrectedMisstatementsMap,
} from '@requests/common/aer/subtasks/uncorrected-misstatements';
import {
  UNCORRECTED_NON_COMPLIANCES_SUB_TASK,
  UNCORRECTED_NON_COMPLIANCES_SUB_TASK_PATH,
  uncorrectedNonCompliancesMap,
} from '@requests/common/aer/subtasks/uncorrected-non-compliances';
import {
  UNCORRECTED_NON_CONFORMITIES_SUB_TASK,
  UNCORRECTED_NON_CONFORMITIES_SUB_TASK_PATH,
  uncorrectedNonConformitiesMap,
} from '@requests/common/aer/subtasks/uncorrected-non-conformities';
import {
  VERIFIER_DETAILS_SUB_TASK,
  VERIFIER_DETAILS_SUB_TASK_PATH,
  verifierDetailsMap,
} from '@requests/common/aer/subtasks/verifier-details';
import { TaskItemStatus } from '@requests/common/task-item-status';

export function getAerVerificationAssessmentsAndFindingsSections(
  routePrefix: string,
  sectionsCompleted?: { [key: string]: string },
  aer?: Aer,
  defaultStatus: TaskItemStatus = TaskItemStatus.NOT_STARTED,
): TaskSection[] {
  return [
    {
      title: 'Verifier assessment',
      tasks: [
        {
          name: VERIFIER_DETAILS_SUB_TASK,
          status: sectionsCompleted
            ? selectStatusForSubtask(VERIFIER_DETAILS_SUB_TASK, sectionsCompleted, defaultStatus)
            : '',
          linkText: verifierDetailsMap.title,
          link: `${routePrefix}/${VERIFIER_DETAILS_SUB_TASK_PATH}`,
        },
        {
          name: OPINION_STATEMENT_SUB_TASK,
          status: sectionsCompleted
            ? selectStatusForSubtask(OPINION_STATEMENT_SUB_TASK, sectionsCompleted, defaultStatus)
            : '',
          linkText: opinionStatementMap.title,
          link: `${routePrefix}/${OPINION_STATEMENT_SUB_TASK_PATH}`,
        },
        {
          name: ETS_COMPLIANCE_RULES_SUB_TASK,
          status: sectionsCompleted
            ? selectStatusForSubtask(ETS_COMPLIANCE_RULES_SUB_TASK, sectionsCompleted, defaultStatus)
            : '',
          linkText: etsComplianceRulesMap.caption,
          link: `${routePrefix}/${ETS_COMPLIANCE_RULES_SUB_TASK_PATH}`,
        },
        {
          name: COMPLIANCE_MONITORING_REPORTING_SUB_TASK,
          status: sectionsCompleted
            ? selectStatusForSubtask(COMPLIANCE_MONITORING_REPORTING_SUB_TASK, sectionsCompleted, defaultStatus)
            : '',
          linkText: complianceMonitoringReportingMap.title,
          link: `${routePrefix}/${COMPLIANCE_MONITORING_REPORTING_SUB_TASK_PATH}`,
        },
        aer?.smf?.exist
          ? {
              name: EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK,
              status: sectionsCompleted
                ? selectStatusForSubtask(
                    EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK,
                    sectionsCompleted,
                    defaultStatus,
                  )
                : '',
              linkText: emissionsReductionClaimVerificationSubtaskListMap.title,
              link: `${routePrefix}/${EMISSIONS_REDUCTION_CLAIMS_VERIFICATION_SUB_TASK_PATH}`,
            }
          : undefined,
        {
          name: OVERALL_VERIFICATION_DECISION_SUB_TASK,
          status: sectionsCompleted
            ? selectStatusForSubtask(OVERALL_VERIFICATION_DECISION_SUB_TASK, sectionsCompleted, defaultStatus)
            : '',
          linkText: overallVerificationDecisionMap.title,
          link: `${routePrefix}/${OVERALL_VERIFICATION_DECISION_SUB_TASK_PATH}`,
        },
      ].filter(Boolean),
    },
    {
      title: 'Verifier findings',
      tasks: [
        {
          name: UNCORRECTED_MISSTATEMENTS_SUB_TASK,
          status: sectionsCompleted
            ? selectStatusForSubtask(UNCORRECTED_MISSTATEMENTS_SUB_TASK, sectionsCompleted, defaultStatus)
            : '',
          linkText: uncorrectedMisstatementsMap.title,
          link: `${routePrefix}/${UNCORRECTED_MISSTATEMENTS_SUB_TASK_PATH}`,
        },
        {
          name: UNCORRECTED_NON_CONFORMITIES_SUB_TASK,
          status: sectionsCompleted
            ? selectStatusForSubtask(UNCORRECTED_NON_CONFORMITIES_SUB_TASK, sectionsCompleted, defaultStatus)
            : '',
          linkText: uncorrectedNonConformitiesMap.title,
          link: `${routePrefix}/${UNCORRECTED_NON_CONFORMITIES_SUB_TASK_PATH}`,
        },
        {
          name: UNCORRECTED_NON_COMPLIANCES_SUB_TASK,
          status: sectionsCompleted
            ? selectStatusForSubtask(UNCORRECTED_NON_COMPLIANCES_SUB_TASK, sectionsCompleted, defaultStatus)
            : '',
          linkText: uncorrectedNonCompliancesMap.title,
          link: `${routePrefix}/${UNCORRECTED_NON_COMPLIANCES_SUB_TASK_PATH}`,
        },
        {
          name: RECOMMENDED_IMPROVEMENTS_SUB_TASK,
          status: sectionsCompleted
            ? selectStatusForSubtask(RECOMMENDED_IMPROVEMENTS_SUB_TASK, sectionsCompleted, defaultStatus)
            : '',
          linkText: recommendedImprovementsMap.title,
          link: `${routePrefix}/${RECOMMENDED_IMPROVEMENTS_SUB_TASK_PATH}`,
        },
        {
          name: DATA_GAPS_METHODOLOGIES_SUB_TASK,
          status: sectionsCompleted
            ? selectStatusForSubtask(DATA_GAPS_METHODOLOGIES_SUB_TASK, sectionsCompleted, defaultStatus)
            : '',
          linkText: dataGapsMethodologiesMap.title,
          link: `${routePrefix}/${DATA_GAPS_METHODOLOGIES_SUB_TASK_PATH}`,
        },
        {
          name: MATERIALITY_LEVEL_SUB_TASK,
          status: sectionsCompleted
            ? selectStatusForSubtask(MATERIALITY_LEVEL_SUB_TASK, sectionsCompleted, defaultStatus)
            : '',
          linkText: materialityLevelMap.title,
          link: `${routePrefix}/${MATERIALITY_LEVEL_SUB_TASK_PATH}`,
        },
      ],
    },
  ];
}

import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import {
  COMPLIANCE_MONITORING_REPORTING_SUB_TASK_PATH,
  DATA_GAPS_METHODOLOGIES_SUB_TASK_PATH,
  ETS_COMPLIANCE_RULES_SUB_TASK_PATH,
  MATERIALITY_LEVEL_SUB_TASK_PATH,
  OPINION_STATEMENT_SUB_TASK_PATH,
  OVERALL_VERIFICATION_DECISION_SUB_TASK_PATH,
  RECOMMENDED_IMPROVEMENTS_SUB_TASK_PATH,
  UNCORRECTED_MISSTATEMENTS_SUB_TASK_PATH,
  UNCORRECTED_NON_COMPLIANCES_SUB_TASK_PATH,
  UNCORRECTED_NON_CONFORMITIES_SUB_TASK_PATH,
  VERIFIER_DETAILS_SUB_TASK_PATH,
} from '@requests/common/aer';
import { AER_VERIFICATION_RETURN_TO_OPERATOR_ROUTE } from '@requests/common/aer/aer.consts';
import { AER_AGGREGATED_DATA_SUB_TASK_PATH } from '@requests/common/aer/subtasks/aer-aggregated-data';
import { AER_PORTS_SUB_TASK } from '@requests/common/aer/subtasks/aer-ports';
import { AER_TOTAL_EMISSIONS_SUB_TASK_PATH } from '@requests/common/aer/subtasks/aer-total-emissions/aer-total-emissions.helpers';
import { AER_VOYAGES_SUB_TASK } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { MONITORING_PLAN_CHANGES_SUB_TASK_PATH } from '@requests/common/aer/subtasks/monitoring-plan-changes';
import { AER_REDUCTION_CLAIM_SUB_TASK } from '@requests/common/aer/subtasks/reduction-claim';
import { EMISSIONS_SUB_TASK_PATH } from '@requests/common/components/emissions/emissions.helpers';
import { OPERATOR_DETAILS_SUB_TASK_PATH } from '@requests/common/components/operator-details';
import { ADDITIONAL_DOCUMENTS_SUB_TASK_PATH } from '@requests/common/utils/additional-documents';
import { canActivateAerVerificationSubmitSendReportAction } from '@requests/tasks/aer-verification-submit/aer-verification-submit.guard';
import {
  provideAerVerificationSubmitPayloadMutators,
  provideAerVerificationSubmitSideEffects,
  provideAerVerificationSubmitStepFlowManagers,
  provideAerVerificationSubmitTaskServices,
} from '@requests/tasks/aer-verification-submit/aer-verification-submit.providers';
import { SEND_REPORT_SUB_TASK_PATH } from '@requests/tasks/aer-verification-submit/subtasks/send-report/send-report.helpers';

export const AER_VERIFICATION_SUBMIT_ROUTES: Routes = [
  {
    path: '',
    providers: [
      PayloadMutatorsHandler,
      provideAerVerificationSubmitPayloadMutators(),
      SideEffectsHandler,
      provideAerVerificationSubmitSideEffects(),
      provideAerVerificationSubmitTaskServices(),
      provideAerVerificationSubmitStepFlowManagers(),
    ],
    children: [
      // Verifier assessment
      {
        path: VERIFIER_DETAILS_SUB_TASK_PATH,
        loadChildren: () =>
          import('@requests/tasks/aer-verification-submit/subtasks/verifier-details').then(
            (c) => c.VERIFIER_DETAILS_ROUTES,
          ),
      },
      {
        path: OPINION_STATEMENT_SUB_TASK_PATH,
        loadChildren: () =>
          import('@requests/tasks/aer-verification-submit/subtasks/opinion-statement').then(
            (c) => c.OPINION_STATEMENT_ROUTES,
          ),
      },
      {
        path: ETS_COMPLIANCE_RULES_SUB_TASK_PATH,
        loadChildren: () =>
          import('@requests/tasks/aer-verification-submit/subtasks/ets-compliance-rules').then(
            (c) => c.ETS_COMPLIANCE_RULES_ROUTES,
          ),
      },
      {
        path: COMPLIANCE_MONITORING_REPORTING_SUB_TASK_PATH,
        loadChildren: () =>
          import('@requests/tasks/aer-verification-submit/subtasks/compliance-monitoring-reporting').then(
            (c) => c.COMPLIANCE_MONITORING_REPORTING_ROUTES,
          ),
      },
      {
        path: OVERALL_VERIFICATION_DECISION_SUB_TASK_PATH,
        loadChildren: () =>
          import('@requests/tasks/aer-verification-submit/subtasks/overall-verification-decision').then(
            (c) => c.OVERALL_VERIFICATION_DECISION_ROUTES,
          ),
      },

      // Verifier findings
      {
        path: UNCORRECTED_MISSTATEMENTS_SUB_TASK_PATH,
        loadChildren: () =>
          import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-misstatements').then(
            (c) => c.UNCORRECTED_MISSTATEMENTS_ROUTES,
          ),
      },
      {
        path: UNCORRECTED_NON_CONFORMITIES_SUB_TASK_PATH,
        loadChildren: () =>
          import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities').then(
            (c) => c.UNCORRECTED_NON_CONFORMITIES_ROUTES,
          ),
      },
      {
        path: UNCORRECTED_NON_COMPLIANCES_SUB_TASK_PATH,
        loadChildren: () =>
          import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-compliances').then(
            (c) => c.UNCORRECTED_NON_COMPLIANCES_ROUTES,
          ),
      },
      {
        path: RECOMMENDED_IMPROVEMENTS_SUB_TASK_PATH,
        loadChildren: () =>
          import('@requests/tasks/aer-verification-submit/subtasks/recommended-improvements').then(
            (c) => c.RECOMMENDED_IMPROVEMENTS_ROUTES,
          ),
      },
      {
        path: DATA_GAPS_METHODOLOGIES_SUB_TASK_PATH,
        loadChildren: () =>
          import('@requests/tasks/aer-verification-submit/subtasks/data-gaps-methodologies').then(
            (c) => c.DATA_GAPS_METHODOLOGIES_ROUTES,
          ),
      },
      {
        path: MATERIALITY_LEVEL_SUB_TASK_PATH,
        loadChildren: () =>
          import('@requests/tasks/aer-verification-submit/subtasks/materiality-level').then(
            (c) => c.MATERIALITY_LEVEL_ROUTES,
          ),
      },

      // AER view-only
      {
        path: OPERATOR_DETAILS_SUB_TASK_PATH,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/aer-verification-submit/view-only-subtasks/operator-details-submitted').then(
            (c) => c.OperatorDetailsSubmittedComponent,
          ),
      },
      {
        path: MONITORING_PLAN_CHANGES_SUB_TASK_PATH,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/aer-verification-submit/view-only-subtasks/monitoring-plan-changes-submitted').then(
            (c) => c.MonitoringPlanChangesSubmittedComponent,
          ),
      },
      {
        path: EMISSIONS_SUB_TASK_PATH,
        children: [
          {
            path: '',
            data: { breadcrumb: false, backlink: '../../' },
            loadComponent: () =>
              import('@requests/tasks/aer-verification-submit/view-only-subtasks/emissions').then(
                (c) => c.ListOfShipsSummaryComponent,
              ),
          },
          {
            path: 'ships/:shipId',
            data: { breadcrumb: false, backlink: '../../' },
            loadComponent: () =>
              import('@requests/tasks/aer-verification-submit/view-only-subtasks/emissions').then(
                (c) => c.ShipSummaryComponent,
              ),
          },
        ],
      },
      {
        path: AER_VOYAGES_SUB_TASK,
        children: [
          {
            path: '',
            data: { breadcrumb: false, backlink: '../../' },
            loadComponent: () =>
              import('@requests/tasks/aer-verification-submit/view-only-subtasks/aer-voyages').then(
                (c) => c.AerListOfVoyagesSubmittedComponent,
              ),
          },
          {
            path: `:voyageId`,
            data: { breadcrumb: false, backlink: '../' },
            loadComponent: () =>
              import('@requests/tasks/aer-verification-submit/view-only-subtasks/aer-voyages').then(
                (c) => c.AerVoyageSubmittedComponent,
              ),
          },
        ],
      },
      {
        path: AER_PORTS_SUB_TASK,
        children: [
          {
            path: '',
            data: { breadcrumb: false, backlink: '../../' },
            loadComponent: () =>
              import('@requests/tasks/aer-verification-submit/view-only-subtasks/aer-ports').then(
                (c) => c.AerListOfPortCallsSubmittedComponent,
              ),
          },
          {
            path: `:portId`,
            data: { breadcrumb: false, backlink: '../' },
            loadComponent: () =>
              import('@requests/tasks/aer-verification-submit/view-only-subtasks/aer-ports').then(
                (c) => c.AerPortCallSubmittedComponent,
              ),
          },
        ],
      },
      {
        path: AER_AGGREGATED_DATA_SUB_TASK_PATH,
        children: [
          {
            path: '',
            data: { breadcrumb: false, backlink: '../../' },
            loadComponent: () =>
              import('@requests/tasks/aer-verification-submit/view-only-subtasks/aer-aggregated-data').then(
                (c) => c.AerAggregatedDataListSubmittedComponent,
              ),
          },
          {
            path: `:dataId`,
            data: { breadcrumb: false, backlink: '../' },
            loadComponent: () =>
              import('@requests/tasks/aer-verification-submit/view-only-subtasks/aer-aggregated-data').then(
                (c) => c.AerAggregatedDataShipSubmittedComponent,
              ),
          },
        ],
      },
      {
        path: AER_REDUCTION_CLAIM_SUB_TASK,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/aer-verification-submit/view-only-subtasks/reduction-claim-submitted').then(
            (c) => c.ReductionClaimSubmittedComponent,
          ),
      },
      {
        path: ADDITIONAL_DOCUMENTS_SUB_TASK_PATH,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/aer-verification-submit/view-only-subtasks/additional-documents-submitted').then(
            (c) => c.AdditionalDocumentsSubmittedComponent,
          ),
      },
      {
        path: AER_TOTAL_EMISSIONS_SUB_TASK_PATH,
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@requests/tasks/aer-verification-submit/view-only-subtasks/aer-total-emissions-submitted').then(
            (c) => c.AerTotalEmissionsSubmittedComponent,
          ),
      },

      // AER Verification Submit
      {
        path: SEND_REPORT_SUB_TASK_PATH,
        canActivate: [canActivateAerVerificationSubmitSendReportAction],
        loadChildren: () =>
          import('@requests/tasks/aer-verification-submit/subtasks/send-report').then((r) => r.SEND_REPORT_ROUTES),
      },

      // Return to operator for changes
      {
        path: AER_VERIFICATION_RETURN_TO_OPERATOR_ROUTE,
        loadChildren: () =>
          import('@requests/tasks/aer-verification-submit/return-to-operator-for-changes').then(
            (r) => r.RETURN_TO_OPERATOR_FOR_CHANGES_ROUTES,
          ),
      },
    ],
  },
];

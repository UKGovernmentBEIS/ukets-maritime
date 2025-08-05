import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { etsComplianceRulesMap, EtsComplianceRulesStep } from '@requests/common/aer';
import {
  canActivateEtsComplianceRulesStep,
  canActivateEtsComplianceRulesSummary,
} from '@requests/tasks/aer-verification-submit/subtasks/ets-compliance-rules/ets-compliance-rules.guard';

export const ETS_COMPLIANCE_RULES_ROUTES: Routes = [
  {
    path: '',
    title: etsComplianceRulesMap.caption,
    canActivate: [canActivateEtsComplianceRulesSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/ets-compliance-rules/ets-compliance-rules-summary').then(
        (c) => c.EtsComplianceRulesSummaryComponent,
      ),
  },
  {
    path: EtsComplianceRulesStep.FORM,
    title: etsComplianceRulesMap.title,
    canActivate: [canActivateEtsComplianceRulesStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(EtsComplianceRulesStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/ets-compliance-rules/ets-compliance-rules-form').then(
        (c) => c.EtsComplianceRulesFormComponent,
      ),
  },
];

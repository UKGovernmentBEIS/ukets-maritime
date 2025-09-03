import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import {
  canActivateEmissionSourcesDecision,
  canActivateEmissionSourcesStep,
  EmissionSourcesWizardStep,
} from '@requests/common/emp/subtasks/emission-sources';
import { emissionSourcesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { canActivateEmissionSourcesSummary } from '@requests/tasks/emp-review/subtasks/emission-sources';

export const EMISSION_SOURCE_ROUTES: Routes = [
  {
    path: '',
    title: emissionSourcesMap.title,
    canActivate: [canActivateEmissionSourcesSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/emission-sources').then((c) => c.EmissionSourcesSummaryComponent),
  },
  {
    path: EmissionSourcesWizardStep.DECISION,
    title: emissionSourcesMap.decision.title,
    canActivate: [canActivateEmissionSourcesDecision],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(EmissionSourcesWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/emp-review/subtasks/emission-sources').then((c) => c.EmissionSourcesDecisionComponent),
  },
  {
    path: EmissionSourcesWizardStep.LIST_COMPLETION,
    title: emissionSourcesMap.emissionCompliance.title,
    canActivate: [canActivateEmissionSourcesStep(EmissionSourcesWizardStep.DECISION)],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(EmissionSourcesWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/emission-sources').then((c) => c.EmissionSourcesCompletionComponent),
  },
  {
    path: EmissionSourcesWizardStep.EMISSION_FACTORS,
    title: emissionSourcesMap.emissionFactors.title,
    canActivate: [canActivateEmissionSourcesStep(EmissionSourcesWizardStep.DECISION)],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(EmissionSourcesWizardStep.SUMMARY, EmissionSourcesWizardStep.LIST_COMPLETION),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/emission-sources').then((c) => c.EmissionSourcesFactorsComponent),
  },
  {
    path: EmissionSourcesWizardStep.EMISSION_COMPLIANCE,
    title: emissionSourcesMap.emissionCompliance.title,
    canActivate: [canActivateEmissionSourcesStep(EmissionSourcesWizardStep.DECISION)],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(EmissionSourcesWizardStep.SUMMARY, EmissionSourcesWizardStep.EMISSION_FACTORS),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/emission-sources').then((c) => c.EmissionSourcesComplianceComponent),
  },
];

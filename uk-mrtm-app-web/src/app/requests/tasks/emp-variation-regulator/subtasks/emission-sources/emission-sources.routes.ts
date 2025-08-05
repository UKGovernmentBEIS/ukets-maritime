import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import {
  canActivateEmissionSourcesDecision,
  canActivateEmissionSourcesStep,
  canActivateEmissionSourcesSummary,
  EmissionSourcesWizardStep,
} from '@requests/common/emp/subtasks/emission-sources';
import { emissionSourcesMap } from '@requests/common/emp/subtasks/subtask-list.map';

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
    path: EmissionSourcesWizardStep.VARIATION_REGULATOR_DECISION,
    title: emissionSourcesMap.variationRegulatorDecision.title,
    canActivate: [canActivateEmissionSourcesDecision],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(EmissionSourcesWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/emp-variation-regulator/subtasks/emission-sources').then(
        (c) => c.EmissionSourcesVariationRegulatorDecisionComponent,
      ),
  },
  {
    path: EmissionSourcesWizardStep.LIST_COMPLETION,
    title: emissionSourcesMap.emissionCompliance.title,
    canActivate: [canActivateEmissionSourcesStep(EmissionSourcesWizardStep.VARIATION_REGULATOR_DECISION)],
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
    canActivate: [canActivateEmissionSourcesStep(EmissionSourcesWizardStep.VARIATION_REGULATOR_DECISION)],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(EmissionSourcesWizardStep.SUMMARY, EmissionSourcesWizardStep.LIST_COMPLETION),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/emission-sources').then((c) => c.EmissionSourcesFactorsComponent),
  },
];

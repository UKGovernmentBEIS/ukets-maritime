import { Routes } from '@angular/router';

import {
  canActivateEmissionSourcesStep,
  canActivateEmissionSourcesSummary,
  EmissionSourcesWizardStep,
} from '@requests/common/emp/subtasks/emission-sources';
import { emissionSourcesMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { backlinkResolver } from '@requests/common/task-navigation';

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
    path: EmissionSourcesWizardStep.LIST_COMPLETION,
    title: emissionSourcesMap.emissionCompliance.title,
    canActivate: [canActivateEmissionSourcesStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(EmissionSourcesWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/emission-sources/emission-sources-completion').then(
        (c) => c.EmissionSourcesCompletionComponent,
      ),
  },
  {
    path: EmissionSourcesWizardStep.EMISSION_FACTORS,
    title: emissionSourcesMap.emissionFactors.title,
    canActivate: [canActivateEmissionSourcesStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(EmissionSourcesWizardStep.SUMMARY, EmissionSourcesWizardStep.LIST_COMPLETION),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/emission-sources/emission-sources-factors').then(
        (c) => c.EmissionSourcesFactorsComponent,
      ),
  },
  {
    path: EmissionSourcesWizardStep.EMISSION_COMPLIANCE,
    title: emissionSourcesMap.emissionCompliance.title,
    canActivate: [canActivateEmissionSourcesStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(EmissionSourcesWizardStep.SUMMARY, EmissionSourcesWizardStep.EMISSION_FACTORS),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/emission-sources/emission-sources-compliance').then(
        (c) => c.EmissionSourcesComplianceComponent,
      ),
  },
];

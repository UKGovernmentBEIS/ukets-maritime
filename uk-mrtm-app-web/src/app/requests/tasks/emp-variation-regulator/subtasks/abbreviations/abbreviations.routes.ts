import { Routes } from '@angular/router';

import {
  AbbreviationsWizardStep,
  canActivateAbbreviationsDecision,
  canActivateAbbreviationsStep,
  canActivateAbbreviationsSummary,
} from '@requests/common/emp/subtasks/abbreviations';
import { abbreviationsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { backlinkResolver } from '@requests/common/task-navigation';

export const ABBREVIATIONS_ROUTES: Routes = [
  {
    path: '',
    title: abbreviationsMap.title,
    canActivate: [canActivateAbbreviationsSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/abbreviations').then((c) => c.AbbreviationsSummaryComponent),
  },
  {
    path: AbbreviationsWizardStep.VARIATION_REGULATOR_DECISION,
    title: abbreviationsMap.variationRegulatorDecision.title,
    canActivate: [canActivateAbbreviationsDecision],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(AbbreviationsWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/emp-variation-regulator/subtasks/abbreviations').then(
        (c) => c.AbbreviationsVariationRegulatorDecisionComponent,
      ),
  },
  {
    path: AbbreviationsWizardStep.ABBREVIATIONS_QUESTION,
    title: abbreviationsMap.abbreviationsQuestion.title,
    canActivate: [canActivateAbbreviationsStep(AbbreviationsWizardStep.VARIATION_REGULATOR_DECISION)],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(AbbreviationsWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/abbreviations').then((c) => c.AbbreviationsQuestionComponent),
  },
];

import { Routes } from '@angular/router';

import {
  AbbreviationsWizardStep,
  canActivateAbbreviationsDecision,
  canActivateAbbreviationsStep,
} from '@requests/common/emp/subtasks/abbreviations';
import { abbreviationsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { backlinkResolver } from '@requests/common/task-navigation';
import { canActivateAbbreviationsSummary } from '@requests/tasks/emp-variation-review/subtasks/abbreviations';

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
    path: AbbreviationsWizardStep.DECISION,
    title: abbreviationsMap.decision.title,
    canActivate: [canActivateAbbreviationsDecision],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(AbbreviationsWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/emp-variation-review/subtasks/abbreviations').then(
        (c) => c.AbbreviationsVariationReviewDecisionComponent,
      ),
  },
  {
    path: AbbreviationsWizardStep.ABBREVIATIONS_QUESTION,
    title: abbreviationsMap.abbreviationsQuestion.title,
    canActivate: [canActivateAbbreviationsStep(AbbreviationsWizardStep.DECISION)],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(AbbreviationsWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/abbreviations').then((c) => c.AbbreviationsQuestionComponent),
  },
];

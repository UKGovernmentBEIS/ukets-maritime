import { Routes } from '@angular/router';

import {
  AbbreviationsWizardStep,
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
    path: AbbreviationsWizardStep.ABBREVIATIONS_QUESTION,
    title: abbreviationsMap.abbreviationsQuestion.title,
    canActivate: [canActivateAbbreviationsStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(AbbreviationsWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/common/emp/subtasks/abbreviations/abbreviations-question').then(
        (c) => c.AbbreviationsQuestionComponent,
      ),
  },
];

import { Routes } from '@angular/router';

import { OperatorDetailsWizardStep } from '@requests/common/components/operator-details';
import {
  canActivateDataGapsStep,
  canActivateDataGapsSummary,
  DataGapsWizardStep,
} from '@requests/common/emp/subtasks/data-gaps';
import { dataGapsMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { backlinkResolver } from '@requests/common/task-navigation';

export const DATA_GAPS_ROUTES: Routes = [
  {
    path: '',
    title: dataGapsMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    canActivate: [canActivateDataGapsSummary],
    loadComponent: () => import('@requests/common/emp/subtasks/data-gaps').then((c) => c.DataGapsSummaryComponent),
  },
  {
    path: DataGapsWizardStep.DATA_GAPS_METHOD,
    title: dataGapsMap.dataGapsMethod.title,
    canActivate: [canActivateDataGapsStep()],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(OperatorDetailsWizardStep.SUMMARY, '../../'),
    },
    loadComponent: () => import('@requests/common/emp/subtasks/data-gaps').then((c) => c.DataGapsMethodComponent),
  },
];

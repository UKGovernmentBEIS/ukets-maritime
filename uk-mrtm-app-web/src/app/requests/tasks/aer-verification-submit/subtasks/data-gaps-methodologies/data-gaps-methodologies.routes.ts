import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { dataGapsMethodologiesMap, DataGapsMethodologiesStep } from '@requests/common/aer';
import {
  canActivateDataGapsMethodologiesMethodApprovedStep,
  canActivateDataGapsMethodologiesMethodConservativeOrMaterialMisstatementStep,
  canActivateDataGapsMethodologiesMethodRequiredStep,
  canActivateDataGapsMethodologiesSummary,
} from '@requests/tasks/aer-verification-submit/subtasks/data-gaps-methodologies/data-gaps-methodologies.guard';

export const DATA_GAPS_METHODOLOGIES_ROUTES: Routes = [
  {
    path: '',
    title: dataGapsMethodologiesMap.caption,
    canActivate: [canActivateDataGapsMethodologiesSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/data-gaps-methodologies/data-gaps-methodologies-summary'
      ).then((c) => c.DataGapsMethodologiesSummaryComponent),
  },
  {
    path: DataGapsMethodologiesStep.METHOD_REQUIRED,
    title: dataGapsMethodologiesMap.methodRequired.title,
    canActivate: [canActivateDataGapsMethodologiesMethodRequiredStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(DataGapsMethodologiesStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/data-gaps-methodologies/data-gaps-methodologies-required'
      ).then((c) => c.DataGapsMethodologiesRequiredComponent),
  },
  {
    path: DataGapsMethodologiesStep.METHOD_APPROVED,
    title: dataGapsMethodologiesMap.methodApproved.title,
    canActivate: [canActivateDataGapsMethodologiesMethodApprovedStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(DataGapsMethodologiesStep.SUMMARY, DataGapsMethodologiesStep.METHOD_REQUIRED),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/data-gaps-methodologies/data-gaps-methodologies-approved'
      ).then((c) => c.DataGapsMethodologiesApprovedComponent),
  },
  {
    path: DataGapsMethodologiesStep.METHOD_CONSERVATIVE,
    title: dataGapsMethodologiesMap.methodConservative.title,
    canActivate: [canActivateDataGapsMethodologiesMethodConservativeOrMaterialMisstatementStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(DataGapsMethodologiesStep.SUMMARY, DataGapsMethodologiesStep.METHOD_APPROVED),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/data-gaps-methodologies/data-gaps-methodologies-conservative'
      ).then((c) => c.DataGapsMethodologiesConservativeComponent),
  },
  {
    path: DataGapsMethodologiesStep.MATERIAL_MISSTATEMENT,
    title: dataGapsMethodologiesMap.materialMisstatementExist.title,
    canActivate: [canActivateDataGapsMethodologiesMethodConservativeOrMaterialMisstatementStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(DataGapsMethodologiesStep.SUMMARY, DataGapsMethodologiesStep.METHOD_CONSERVATIVE),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/data-gaps-methodologies/data-gaps-methodologies-misstatement'
      ).then((c) => c.DataGapsMethodologiesMisstatementComponent),
  },
];

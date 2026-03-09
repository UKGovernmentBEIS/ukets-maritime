import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { recommendedImprovementsMap, RecommendedImprovementsStep } from '@requests/common/aer';
import {
  canActivateRecommendedImprovementsAddOrList,
  canActivateRecommendedImprovementsEditOrRemove,
  canActivateRecommendedImprovementsExistFormStep,
  canActivateRecommendedImprovementsSummary,
} from '@requests/tasks/aer-verification-submit/subtasks/recommended-improvements/recommended-improvements.guard';

export const RECOMMENDED_IMPROVEMENTS_ROUTES: Routes = [
  {
    path: '',
    title: recommendedImprovementsMap.caption,
    canActivate: [canActivateRecommendedImprovementsSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/recommended-improvements/recommended-improvements-summary'
      ).then((c) => c.RecommendedImprovementsSummaryComponent),
  },
  {
    path: RecommendedImprovementsStep.EXIST_FORM,
    title: recommendedImprovementsMap.title,
    canActivate: [canActivateRecommendedImprovementsExistFormStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(RecommendedImprovementsStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/recommended-improvements/recommended-improvements-exist'
      ).then((c) => c.RecommendedImprovementsExistComponent),
  },

  {
    path: RecommendedImprovementsStep.ITEMS_LIST,
    title: recommendedImprovementsMap.title,
    canActivate: [canActivateRecommendedImprovementsAddOrList],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(RecommendedImprovementsStep.SUMMARY, RecommendedImprovementsStep.EXIST_FORM),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/recommended-improvements/recommended-improvements-list'
      ).then((c) => c.RecommendedImprovementsListComponent),
  },
  {
    path: RecommendedImprovementsStep.ITEM_FORM_ADD,
    title: recommendedImprovementsMap.improvementAdd.title,
    canActivate: [canActivateRecommendedImprovementsAddOrList],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(RecommendedImprovementsStep.SUMMARY, RecommendedImprovementsStep.ITEMS_LIST),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/recommended-improvements/recommended-improvements-improvement-form'
      ).then((c) => c.RecommendedImprovementsImprovementFormComponent),
  },
  {
    path: `:reference/${RecommendedImprovementsStep.ITEM_FORM_EDIT}`,
    title: recommendedImprovementsMap.improvementEdit.title,
    canActivate: [canActivateRecommendedImprovementsEditOrRemove],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        `../${RecommendedImprovementsStep.SUMMARY}`,
        `../${RecommendedImprovementsStep.ITEMS_LIST}`,
      ),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/recommended-improvements/recommended-improvements-improvement-form'
      ).then((c) => c.RecommendedImprovementsImprovementFormComponent),
  },
  {
    path: `:reference/${RecommendedImprovementsStep.ITEM_DELETE}`,
    title: recommendedImprovementsMap.improvementDelete.title,
    canActivate: [canActivateRecommendedImprovementsEditOrRemove],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        `../${RecommendedImprovementsStep.SUMMARY}`,
        `../${RecommendedImprovementsStep.ITEMS_LIST}`,
      ),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/recommended-improvements/recommended-improvements-improvement-delete'
      ).then((c) => c.RecommendedImprovementsImprovementDeleteComponent),
  },
];

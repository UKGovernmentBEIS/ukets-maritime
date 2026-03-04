import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { uncorrectedMisstatementsMap, UncorrectedMisstatementsStep } from '@requests/common/aer';
import {
  canActivateUncorrectedMisstatementsAddOrList,
  canActivateUncorrectedMisstatementsEditOrRemove,
  canActivateUncorrectedMisstatementsExistFormStep,
  canActivateUncorrectedMisstatementsSummary,
} from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-misstatements/uncorrected-misstatements.guard';

export const UNCORRECTED_MISSTATEMENTS_ROUTES: Routes = [
  {
    path: '',
    title: uncorrectedMisstatementsMap.title,
    canActivate: [canActivateUncorrectedMisstatementsSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-misstatements/uncorrected-misstatements-summary').then(
        (c) => c.UncorrectedMisstatementsSummaryComponent,
      ),
  },
  {
    path: UncorrectedMisstatementsStep.EXIST_FORM,
    title: uncorrectedMisstatementsMap.exist.title,
    canActivate: [canActivateUncorrectedMisstatementsExistFormStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(UncorrectedMisstatementsStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-misstatements/uncorrected-misstatements-exist').then(
        (c) => c.UncorrectedMisstatementsExistComponent,
      ),
  },
  {
    path: UncorrectedMisstatementsStep.ITEMS_LIST,
    title: uncorrectedMisstatementsMap.list.title,
    canActivate: [canActivateUncorrectedMisstatementsAddOrList],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(UncorrectedMisstatementsStep.SUMMARY, UncorrectedMisstatementsStep.EXIST_FORM),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-misstatements/uncorrected-misstatements-list').then(
        (c) => c.UncorrectedMisstatementsListComponent,
      ),
  },
  {
    path: UncorrectedMisstatementsStep.ITEM_FORM_ADD,
    title: uncorrectedMisstatementsMap.itemAdd.title,
    canActivate: [canActivateUncorrectedMisstatementsAddOrList],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(UncorrectedMisstatementsStep.SUMMARY, UncorrectedMisstatementsStep.ITEMS_LIST),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-misstatements/uncorrected-misstatements-item-form').then(
        (c) => c.UncorrectedMisstatementsItemFormComponent,
      ),
  },
  {
    path: `:reference/${UncorrectedMisstatementsStep.ITEM_FORM_EDIT}`,
    title: uncorrectedMisstatementsMap.itemEdit.title,
    canActivate: [canActivateUncorrectedMisstatementsEditOrRemove],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        `../${UncorrectedMisstatementsStep.SUMMARY}`,
        `../${UncorrectedMisstatementsStep.ITEMS_LIST}`,
      ),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-misstatements/uncorrected-misstatements-item-form').then(
        (c) => c.UncorrectedMisstatementsItemFormComponent,
      ),
  },
  {
    path: `:reference/${UncorrectedMisstatementsStep.ITEM_DELETE}`,
    title: uncorrectedMisstatementsMap.itemDelete.title,
    canActivate: [canActivateUncorrectedMisstatementsEditOrRemove],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        `../${UncorrectedMisstatementsStep.SUMMARY}`,
        `../${UncorrectedMisstatementsStep.ITEMS_LIST}`,
      ),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-misstatements/uncorrected-misstatements-item-delete').then(
        (c) => c.UncorrectedMisstatementsItemDeleteComponent,
      ),
  },
];

import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { uncorrectedNonCompliancesMap, UncorrectedNonCompliancesStep } from '@requests/common/aer';
import {
  canActivateUncorrectedNonCompliancesAddOrList,
  canActivateUncorrectedNonCompliancesEditOrRemove,
  canActivateUncorrectedNonCompliancesExistFormStep,
  canActivateUncorrectedNonCompliancesSummary,
} from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-compliances/uncorrected-non-compliances.guard';

export const UNCORRECTED_NON_COMPLIANCES_ROUTES: Routes = [
  {
    path: '',
    title: uncorrectedNonCompliancesMap.title,
    canActivate: [canActivateUncorrectedNonCompliancesSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-compliances/uncorrected-non-compliances-summary'
      ).then((c) => c.UncorrectedNonCompliancesSummaryComponent),
  },
  {
    path: UncorrectedNonCompliancesStep.EXIST_FORM,
    title: uncorrectedNonCompliancesMap.exist.title,
    canActivate: [canActivateUncorrectedNonCompliancesExistFormStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(UncorrectedNonCompliancesStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-compliances/uncorrected-non-compliances-exist'
      ).then((c) => c.UncorrectedNonCompliancesExistComponent),
  },
  {
    path: UncorrectedNonCompliancesStep.ITEMS_LIST,
    title: uncorrectedNonCompliancesMap.list.title,
    canActivate: [canActivateUncorrectedNonCompliancesAddOrList],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(UncorrectedNonCompliancesStep.SUMMARY, UncorrectedNonCompliancesStep.EXIST_FORM),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-compliances/uncorrected-non-compliances-list'
      ).then((c) => c.UncorrectedNonCompliancesListComponent),
  },
  {
    path: UncorrectedNonCompliancesStep.ITEM_FORM_ADD,
    title: uncorrectedNonCompliancesMap.itemAdd.title,
    canActivate: [canActivateUncorrectedNonCompliancesAddOrList],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(UncorrectedNonCompliancesStep.SUMMARY, UncorrectedNonCompliancesStep.ITEMS_LIST),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-compliances/uncorrected-non-compliances-item-form'
      ).then((c) => c.UncorrectedNonCompliancesItemFormComponent),
  },
  {
    path: `:reference/${UncorrectedNonCompliancesStep.ITEM_FORM_EDIT}`,
    title: uncorrectedNonCompliancesMap.itemEdit.title,
    canActivate: [canActivateUncorrectedNonCompliancesEditOrRemove],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        `../${UncorrectedNonCompliancesStep.SUMMARY}`,
        `../${UncorrectedNonCompliancesStep.ITEMS_LIST}`,
      ),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-compliances/uncorrected-non-compliances-item-form'
      ).then((c) => c.UncorrectedNonCompliancesItemFormComponent),
  },
  {
    path: `:reference/${UncorrectedNonCompliancesStep.ITEM_DELETE}`,
    title: uncorrectedNonCompliancesMap.itemDelete.title,
    canActivate: [canActivateUncorrectedNonCompliancesEditOrRemove],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        `../${UncorrectedNonCompliancesStep.SUMMARY}`,
        `../${UncorrectedNonCompliancesStep.ITEMS_LIST}`,
      ),
    },
    loadComponent: () =>
      import(
        '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-compliances/uncorrected-non-compliances-item-delete'
      ).then((c) => c.UncorrectedNonCompliancesItemDeleteComponent),
  },
];

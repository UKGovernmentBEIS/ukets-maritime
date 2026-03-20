import { Routes } from '@angular/router';

import { backlinkResolver } from '@requests/common';
import { uncorrectedNonConformitiesMap, UncorrectedNonConformitiesStep } from '@requests/common/aer';
import {
  canActivateUncorrectedNonConformitiesAddOrList,
  canActivateUncorrectedNonConformitiesEditOrRemove,
  canActivateUncorrectedNonConformitiesExistFormStep,
  canActivateUncorrectedNonConformitiesPriorYearIssuesAddOrList,
  canActivateUncorrectedNonConformitiesPriorYearIssuesEditOrRemove,
  canActivateUncorrectedNonConformitiesPriorYearIssuesExistFormStep,
  canActivateUncorrectedNonConformitiesSummary,
} from '@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities.guard';

export const UNCORRECTED_NON_CONFORMITIES_ROUTES: Routes = [
  {
    path: '',
    title: uncorrectedNonConformitiesMap.title,
    canActivate: [canActivateUncorrectedNonConformitiesSummary],
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities-summary').then(
        (c) => c.UncorrectedNonConformitiesSummaryComponent,
      ),
  },
  {
    path: UncorrectedNonConformitiesStep.EXIST_FORM,
    title: uncorrectedNonConformitiesMap.exist.title,
    canActivate: [canActivateUncorrectedNonConformitiesExistFormStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(UncorrectedNonConformitiesStep.SUMMARY, '../../'),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities-exist').then(
        (c) => c.UncorrectedNonConformitiesExistComponent,
      ),
  },
  {
    path: UncorrectedNonConformitiesStep.ITEMS_LIST,
    title: uncorrectedNonConformitiesMap.list.title,
    canActivate: [canActivateUncorrectedNonConformitiesAddOrList],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(UncorrectedNonConformitiesStep.SUMMARY, UncorrectedNonConformitiesStep.EXIST_FORM),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities-list').then(
        (c) => c.UncorrectedNonConformitiesListComponent,
      ),
  },
  {
    path: UncorrectedNonConformitiesStep.ITEM_FORM_ADD,
    title: uncorrectedNonConformitiesMap.itemAdd.title,
    canActivate: [canActivateUncorrectedNonConformitiesAddOrList],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(UncorrectedNonConformitiesStep.SUMMARY, UncorrectedNonConformitiesStep.ITEMS_LIST),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities-item-form').then(
        (c) => c.UncorrectedNonConformitiesItemFormComponent,
      ),
  },
  {
    path: `:reference/${UncorrectedNonConformitiesStep.ITEM_FORM_EDIT}`,
    title: uncorrectedNonConformitiesMap.itemEdit.title,
    canActivate: [canActivateUncorrectedNonConformitiesEditOrRemove],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        `../${UncorrectedNonConformitiesStep.SUMMARY}`,
        `../${UncorrectedNonConformitiesStep.ITEMS_LIST}`,
      ),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities-item-form').then(
        (c) => c.UncorrectedNonConformitiesItemFormComponent,
      ),
  },
  {
    path: `:reference/${UncorrectedNonConformitiesStep.ITEM_DELETE}`,
    title: uncorrectedNonConformitiesMap.itemDelete.title,
    canActivate: [canActivateUncorrectedNonConformitiesEditOrRemove],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        `../${UncorrectedNonConformitiesStep.SUMMARY}`,
        `../${UncorrectedNonConformitiesStep.ITEMS_LIST}`,
      ),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities-item-delete').then(
        (c) => c.UncorrectedNonConformitiesItemDeleteComponent,
      ),
  },

  // PRIOR YEAR
  {
    path: UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUES_EXIST_FORM,
    title: uncorrectedNonConformitiesMap.priorYearIssuesExist.title,
    canActivate: [canActivateUncorrectedNonConformitiesPriorYearIssuesExistFormStep],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(UncorrectedNonConformitiesStep.SUMMARY, UncorrectedNonConformitiesStep.ITEMS_LIST),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities-prior-year-issues-exist').then(
        (c) => c.UncorrectedNonConformitiesPriorYearIssuesExistComponent,
      ),
  },
  {
    path: UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUES_LIST,
    title: uncorrectedNonConformitiesMap.priorYearList.title,
    canActivate: [canActivateUncorrectedNonConformitiesPriorYearIssuesAddOrList],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        UncorrectedNonConformitiesStep.SUMMARY,
        UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUES_EXIST_FORM,
      ),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities-prior-year-issues-list').then(
        (c) => c.UncorrectedNonConformitiesPriorYearIssuesListComponent,
      ),
  },
  {
    path: UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUE_FORM_ADD,
    title: uncorrectedNonConformitiesMap.priorYearIssueAdd.title,
    canActivate: [canActivateUncorrectedNonConformitiesPriorYearIssuesAddOrList],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        UncorrectedNonConformitiesStep.SUMMARY,
        UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUES_LIST,
      ),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities-prior-year-issue-form').then(
        (c) => c.UncorrectedNonConformitiesPriorYearIssueFormComponent,
      ),
  },
  {
    path: `:reference/${UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUE_FORM_EDIT}`,
    title: uncorrectedNonConformitiesMap.priorYearIssueEdit.title,
    canActivate: [canActivateUncorrectedNonConformitiesPriorYearIssuesEditOrRemove],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        `../${UncorrectedNonConformitiesStep.SUMMARY}`,
        `../${UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUES_LIST}`,
      ),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities-prior-year-issue-form').then(
        (c) => c.UncorrectedNonConformitiesPriorYearIssueFormComponent,
      ),
  },
  {
    path: `:reference/${UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUE_DELETE}`,
    title: uncorrectedNonConformitiesMap.priorYearIssueDelete.title,
    canActivate: [canActivateUncorrectedNonConformitiesPriorYearIssuesEditOrRemove],
    data: { breadcrumb: false },
    resolve: {
      backlink: backlinkResolver(
        `../${UncorrectedNonConformitiesStep.SUMMARY}`,
        `../${UncorrectedNonConformitiesStep.PRIOR_YEAR_ISSUES_LIST}`,
      ),
    },
    loadComponent: () =>
      import('@requests/tasks/aer-verification-submit/subtasks/uncorrected-non-conformities/uncorrected-non-conformities-prior-year-issue-delete').then(
        (c) => c.UncorrectedNonConformitiesPriorYearIssueDeleteComponent,
      ),
  },
];
